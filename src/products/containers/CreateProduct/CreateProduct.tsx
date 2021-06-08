import { FetchContext } from "auth/contexts/FetchContext";
import { Product, ProductForm } from "products";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

export function CreateProduct() {
  const { push } = useHistory();
  const goBackToProducts = () => push("/products");
  const authAxios = useContext(FetchContext);
  const onCreateProduct = async (newProduct: Partial<Product>) => {
    await authAxios.post(`/products`, newProduct);
    goBackToProducts();
  };

  return (
    <ProductForm
      onSubmit={onCreateProduct}
      onCancel={goBackToProducts}
    ></ProductForm>
  );
}
