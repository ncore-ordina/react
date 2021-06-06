import React, { useState, useEffect } from "react";
import { match, useRouteMatch, useHistory } from "react-router-dom";
import { Product, ProductForm } from "products";
import axios from "axios";

export function EditProduct() {
  const {
    params: { productId },
  }: match<{ productId: string }> = useRouteMatch();
  const { push } = useHistory();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const goBackToProducts = () => push("/products");
  const onEditProduct = async (productFields: Partial<Product>) => {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/products/${productId}`,
      productFields
    );
    goBackToProducts();
  };
  const retrieveProduct = async () => {
    const result = (
      await axios.get(`${process.env.REACT_APP_API_URL}/products/${productId}`)
    ).data;
    setProduct(result);
  };

  useEffect(() => {
    retrieveProduct();
    // eslint-disable-next-line
  }, []);

  return product ? (
    <ProductForm
      product={product}
      onSubmit={onEditProduct}
      onCancel={goBackToProducts}
    ></ProductForm>
  ) : null;
}
