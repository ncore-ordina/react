import { Product } from "products";
import React from "react";

interface Props {
  product: Product;
  children: React.ReactNode;
}

export function ProductRow({
  product,

  children,
}: Props) {
  return (
    <tr>
      <td className="border px-4 py-2">{product.id}</td>
      <td className="border px-4 py-2">{product.name}</td>
      <td className="border px-4 py-2">{product.description}</td>
      <td className="border px-4 py-2">{product.productCode}</td>
      <td className="border px-4 py-2"> {children}</td>
    </tr>
  );
}
