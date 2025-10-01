﻿import { NextRequest, NextResponse } from "next/server";
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
    const response = await fetch(getApiUrl("admin/colors"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(request),
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {

    return NextResponse.json(
      { success: false, message: "Failed to fetch colors" },
      { status: 500 }
    );
  }
}

// POST /api/admin/colors - Create new color
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(getApiUrl("admin/colors"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(request),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {

    return NextResponse.json(
      { success: false, message: "Failed to create color" },
      { status: 500 }
    );
  }
}
