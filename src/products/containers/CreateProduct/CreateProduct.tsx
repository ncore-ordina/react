import React from "react";
import { useHistory } from "react-router-dom";
import { ProductForm, Product } from "products";
import axios from "axios";

export function CreateProduct() {
  const { push } = useHistory();
  const goBackToProducts = () => push("/products");
  const onCreateProduct = async (newProduct: Partial<Product>) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/products`, newProduct);
    goBackToProducts();
  };

  return (
    <ProductForm
      onSubmit={onCreateProduct}
      onCancel={goBackToProducts}
    ></ProductForm>
  );
}
