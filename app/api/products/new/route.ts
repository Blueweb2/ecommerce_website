import { NextRequest, NextResponse } from "next/server";
// import Product from "@/models/Product"; // Assuming you have a Product model
// import connectDB from "@/lib/db"; // Assuming you have a DB connection

export async function GET(request: NextRequest) {
  try {
    // await connectDB(); // Connect to database

    // const products = await Product.find({
    //   isPublished: true,
    //   sections: { $in: ["new-in"] }
    // })
    // .sort({ createdAt: -1 })
    // .limit(12)
    // .select("_id name slug price discountPrice images brand")
    // .lean();

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