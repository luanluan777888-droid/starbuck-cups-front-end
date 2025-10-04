import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/api-config";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = new URLSearchParams();

    // Pass through all search parameters to the backend
    searchParams.forEach((value, key) => {
      query.append(key, value);
    });

    const backendUrl = `${getApiUrl("products/public")}${query.toString() ? "?" + query.toString() : ""}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    console.log("📊 [Products API] Response debug:", {
      status: response.status,
      success: data.success,
      totalItems: data.data?.totalItems || data.data?.pagination?.total_items,
      itemsCount: data.data?.items?.length,
      hasItems: !!data.data?.items,
      queryParams: query.toString(),
      backendUrl,
      paginationInfo: data.data?.pagination,
      sampleData: data.data?.items?.slice(0, 2)
    });

    return NextResponse.json(data);
  } catch {

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
