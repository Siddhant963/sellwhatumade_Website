import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { serverFetchOrNull } from "@/lib/api/server";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Product } from "@/lib/api/types";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await serverFetchOrNull<Product>(`/api/v1/products/${id}`);
  if (!product) return { title: "Product not found" };

  const image = product.images?.[0] || DEFAULT_OG_IMAGE;
  const title = `${product.name} — Buy Handmade Online`;
  const description =
    product.description?.slice(0, 155) ||
    `${product.name}, an authentic handcrafted piece from an Indian artisan. Shop handmade on SellWhatUMade.`;
  const url = `${SITE_URL}/product/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: image, width: 600, height: 600, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await serverFetchOrNull<Product>(`/api/v1/products/${id}`);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images?.length ? product.images : [DEFAULT_OG_IMAGE],
    brand: { "@type": "Brand", name: "SellWhatUMade" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${id}`,
      priceCurrency: "INR",
      price: (product.pricePaise / 100).toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient />
    </>
  );
}
