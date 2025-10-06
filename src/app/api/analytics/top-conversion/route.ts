import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-config";

// Get top conversion products with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";
    const page = searchParams.get("page") || "1";

    // Forward to backend analytics service
    const response = await fetch(
      getApiUrl(`analytics/top-conversion?limit=${limit}&page=${page}`),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend request failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching top conversion products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch top conversion products",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
