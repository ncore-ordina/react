import { FetchContext } from "auth/contexts/FetchContext";
import { Product, ProductForm } from "products";
import React, { useContext, useEffect, useState } from "react";
import { match, useHistory, useRouteMatch } from "react-router-dom";

export function EditProduct() {
  const {
    params: { productId },
  }: match<{ productId: string }> = useRouteMatch();
  const { push } = useHistory();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const goBackToProducts = () => push("/products");
  const authAxios = useContext(FetchContext);
  const onEditProduct = async (productFields: Partial<Product>) => {
    await authAxios.put(`/products/${productId}`, productFields);
    goBackToProducts();
  };
  const retrieveProduct = async () => {
    const result = (await authAxios.get(`/products/${productId}`)).data;
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
