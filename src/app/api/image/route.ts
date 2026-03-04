import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { convertDriveUrl } from "@/utils/googleDriveHelper";

// Tạo cache directory
// Default cache directory
const DEFAULT_CACHE_DIR = path.join(process.cwd(), ".next", "cache", "images");

// Get cache directory based on environment
function getCacheDir(): string {
  // In serverless environments (Vercel, AWS Lambda), use /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "image-cache");
  }
  // In local/VPS, use .next/cache/images
  return DEFAULT_CACHE_DIR;
}

const CACHE_DIR = getCacheDir();
const BYPASS_OPTIMIZATION_HOST_SUFFIXES = [
  "googleusercontent.com",
  "amazonaws.com",
  "cloudfront.net",
];
const BYPASS_OPTIMIZATION_HOSTS = new Set(["drive.google.com", "docs.google.com"]);

// Ensure cache directory exists
async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    // Create directory recursively to ensure all parent dirs exist
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
}

// Generate cache key from URL and params
function getCacheKey(
  url: string,
  width: number,
  quality: number,
  format: string
): string {
  const hash = crypto
    .createHash("md5")
    .update(`${url}-${width}-${quality}-${format}`)
    .digest("hex");
  return `${hash}.${format}`;
}

function resolveOutputFormat(
  requestedFormat: string,
  acceptHeader: string | null
): "avif" | "webp" | "jpeg" | "png" {
  if (requestedFormat !== "auto") {
    return requestedFormat as "avif" | "webp" | "jpeg" | "png";
  }

  const accept = (acceptHeader || "").toLowerCase();
  if (accept.includes("image/avif")) return "avif";
  if (accept.includes("image/webp")) return "webp";
  return "jpeg";
}

function shouldBypassOptimization(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (BYPASS_OPTIMIZATION_HOSTS.has(hostname)) return true;

    return BYPASS_OPTIMIZATION_HOST_SUFFIXES.some(
      (suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`)
    );
  } catch {
    return false;
  }
}

// Fetch image from URL
async function fetchImage(url: string): Promise<Buffer> {
  const timeouts = [5000, 9000];
  let lastError: unknown;

  for (const timeout of timeouts) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
          "User-Agent": "hasron-image-proxy/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to fetch image from origin");
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let url = searchParams.get("url");
    const width = parseInt(searchParams.get("w") || "1200");
    const quality = parseInt(searchParams.get("q") || "70");
    const requestedFormat = searchParams.get("f") || "auto";

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Convert Google Drive URLs to direct googleusercontent URLs
    url = convertDriveUrl(url);

    // Validate format
    if (!["auto", "webp", "avif", "jpeg", "png"].includes(requestedFormat)) {
      return NextResponse.json(
        { error: "Invalid format. Supported: auto, webp, avif, jpeg, png" },
        { status: 400 }
      );
    }

    const outputFormat = resolveOutputFormat(
      requestedFormat,
      request.headers.get("accept")
    );

    if (shouldBypassOptimization(url)) {
      const bypass = NextResponse.redirect(url, 307);
      bypass.headers.set("Cache-Control", "public, max-age=3600");
      return bypass;
    }

    // Ensure cache directory exists
    await ensureCacheDir();

    // Check cache first
    const cacheKey = getCacheKey(url, width, quality, outputFormat);
    const cachePath = path.join(CACHE_DIR, cacheKey);

    try {
      const cachedImage = await fs.readFile(cachePath);
      const cachedBody = cachedImage as unknown as BodyInit;
      return new NextResponse(cachedBody, {
        headers: {
          "Content-Type": `image/${outputFormat}`,
          "Cache-Control": "public, max-age=31536000, immutable",
          Vary: "Accept",
        },
      });
    } catch {
      // Cache miss, continue to optimization
    }

    // Fetch original image - fallback to direct URL if origin is slow/unavailable
    let imageBuffer: Buffer;
    try {
      imageBuffer = await fetchImage(url);
    } catch {
      const fallback = NextResponse.redirect(url, 307);
      fallback.headers.set("Cache-Control", "public, max-age=300");
      return fallback;
    }

    // Process image with sharp
    let sharpInstance = sharp(imageBuffer);

    // Get metadata to check if resize is needed
    const metadata = await sharpInstance.metadata();

    // Only resize if image is larger than requested width
    if (metadata.width && metadata.width > width) {
      sharpInstance = sharpInstance.resize(width, null, {
        withoutEnlargement: true,
        fit: "inside",
      });
    }

    // Convert to requested format with optimized settings
    switch (outputFormat) {
      case "webp":
        sharpInstance = sharpInstance.webp({
          quality,
          effort: 6,
          smartSubsample: true,
        });
        break;
      case "avif":
        sharpInstance = sharpInstance.avif({
          quality,
          effort: 9,
        });
        break;
      case "jpeg":
        sharpInstance = sharpInstance.jpeg({
          quality,
          mozjpeg: true,
        });
        break;
      case "png":
        sharpInstance = sharpInstance.png({
          quality,
          compressionLevel: 9, // Max compression
        });
        break;
    }

    const optimizedImage = await sharpInstance.toBuffer();

    // Save to cache
    await fs.writeFile(cachePath, optimizedImage);

    // Return optimized image
    const optimizedBody = optimizedImage as unknown as BodyInit;
    return new NextResponse(optimizedBody, {
      headers: {
        "Content-Type": `image/${outputFormat}`,
        "Cache-Control": "public, max-age=31536000, immutable",
        Vary: "Accept",
      },
    });
  } catch (error) {
    console.error("Image optimization error:", error);
    return NextResponse.json(
      {
        error: "Failed to optimize image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
