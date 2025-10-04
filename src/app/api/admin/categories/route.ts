import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-config";

// Helper function to forward auth headers
function getAuthHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {};

  // Forward authorization header from client request
  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    headers["authorization"] = authHeader;
  }

  return headers;
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 [API] Fetching categories from backend...");

    // Extract query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "20";

    console.log("📄 [API] Pagination params:", { page, size });

    const response = await fetch(
      getApiUrl(`admin/categories?page=${page}&size=${size}`),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(request),
        },
      }
    );

    const data = await response.json();
    
    console.log("📊 [API Debug] Categories response:", {
      status: response.status,
      success: data.success,
      totalItems: data.data?.totalItems,
      currentPage: data.data?.currentPage,
      totalPages: data.data?.totalPages,
      itemsCount: data.data?.items?.length,
      hasItems: !!data.data?.items,
      requestUrl: `admin/categories?page=${page}&size=${size}`,
      sampleData: data.data?.items?.slice(0, 3)
    });

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(getApiUrl("admin/categories"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(request),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}
