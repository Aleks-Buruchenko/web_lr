import { ProductDetails } from "@/app/components/ProductDetails";
import { getProductById } from "@/lib/dummyjson";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  const product =
    Number.isInteger(productId) && productId > 0
      ? await getProductById(productId)
      : null;

  return <ProductDetails productId={productId} initialProduct={product} />;
}
