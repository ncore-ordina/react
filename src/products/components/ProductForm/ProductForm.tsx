import React, { useState } from "react";
import { InputField, TextAreaField, SubmitForm } from "components";
import { Product } from "products/models";
import { FormField } from "models/form-field.interface";

export interface ProductFormFields {
  name: FormField;
  description: FormField;
  productCode: FormField;
}

interface Props {
  product?: Product;
  onSubmit: (product: Partial<Product>) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: Props) {
  const [fields, setFields] = useState<ProductFormFields>({
    name: {
      value: !!product ? product.name : "",
      errors: [],
    },
    description: {
      value: !!product ? product.description : "",
      errors: [],
    },
    productCode: {
      value: !!product ? product.productCode : "",
      errors: [],
    },
  });
  const { name, description, productCode } = fields;
  const getValidationErrors = (key: string, value: string): string[] => {
    switch (key) {
      case "name":
        return value.trim().length === 0 ? ["Name is required"] : [];
      case "productCode":
        return value.trim().length === 0 ? ["Product code is required"] : [];
      default:
        return [];
    }
  };
  const isFormValid =
    Object.entries(fields).reduce(
      (amountOfErrors, [key, field]) =>
        amountOfErrors + getValidationErrors(key, field.value).length,
      0
    ) === 0;
  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const key = e.target.name;
    const value = e.target.value;
    const errors = getValidationErrors(key, value);

    setFields({
      ...fields,
      [key]: {
        value,
        errors,
      },
    });
  };
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFormValid) {
      onSubmit({
        name: name.value,
        description: description.value,
        productCode: productCode.value,
      });
    }
  };

  return (
    <form className="w-full" onSubmit={handleOnSubmit}>
      <InputField
        hasFocus
        name="name"
        label="Name"
        value={name.value}
        errors={name.errors}
        onChange={handleOnChange}
      ></InputField>
      <TextAreaField
        name="description"
        label="Description"
        value={description.value}
        errors={description.errors}
        onChange={handleOnChange}
      ></TextAreaField>
      <InputField
        name="productCode"
        label="Product Code"
        value={productCode.value}
        errors={productCode.errors}
        onChange={handleOnChange}
      ></InputField>
      <SubmitForm isDisabled={!isFormValid} onCancel={onCancel}></SubmitForm>
    </form>
  );
}
