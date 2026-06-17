import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {

    // For now, return mock data
    const products = [
      {
        _id: "1",
        name: "Sample New Product 1",
        slug: "sample-new-product-1",
        price: 100,
        discountPrice: 80,
        images: [{ url: "/home/herosection/hero-right-bottom.png" }],
        brand: "Brand A"
      },
      {
        _id: "2",
        name: "Sample New Product 2",
        slug: "sample-new-product-2",
        price: 200,
        images: [{ url: "/home/herosection/hero-right-top.png" }],
        brand: "Brand B"
      }
    ];

    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error("Error fetching new products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch new products" },
      { status: 500 }
    );
  }
}