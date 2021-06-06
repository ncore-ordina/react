import React, { useState } from "react";
import { Client } from "clients";
import { InputField, SubmitForm } from "components";
import { FormField } from "models/form-field.interface";

enum FormInputField {
  FirstName = "firstName",
  LastName = "lastName",
  Email = "email",
  Birthday = "birthday",
  City = "city",
  Zip = "zip",
}

interface ClientFormFields {
  firstName: FormField;
  lastName: FormField;
  email: FormField;
  birthday: FormField;
  city: FormField;
  zip: FormField;
}

interface Props {
  client?: Client;
  onSubmit: (product: Partial<Client>) => void;
  onCancel: () => void;
}

export function ClientForm({ client, onSubmit, onCancel }: Props) {
  const [fields, setFields] = useState<ClientFormFields>({
    firstName: { value: !!client ? client.firstName : "", errors: [] },
    lastName: { value: !!client ? client.lastName : "", errors: [] },
    email: { value: !!client ? client.email : "", errors: [] },
    birthday: { value: !!client ? client.birthday : "", errors: [] },
    city: { value: !!client ? client.city : "", errors: [] },
    zip: { value: !!client ? client.zip : "", errors: [] },
  });
  const { firstName, lastName, email, birthday, city, zip } = fields;

  // Validation
  const getValidationErrors = (key: string, value: string): string[] => {
    switch (key) {
      case FormInputField.FirstName:
        return value.trim().length === 0 ? ["First name is required"] : [];
      case FormInputField.LastName:
        return value.trim().length === 0 ? ["Last name is required"] : [];
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
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const key = event.target.name;
    const value = event.target.value;
    const errors = getValidationErrors(key, value);

    setFields({
      ...fields,
      [key]: {
        value,
        errors,
      },
    });
  };

  // Submit
  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormValid) {
      onSubmit({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        birthday: birthday.value,
        city: city.value,
        zip: zip.value,
      });
    }
  };

  return (
    <form className="w-full" onSubmit={handleOnSubmit}>
      <InputField
        hasFocus
        name={FormInputField.FirstName}
        label="First name"
        value={firstName.value}
        errors={firstName.errors}
        onChange={handleOnChange}
      ></InputField>
      <InputField
        name={FormInputField.LastName}
        label="Last name"
        value={lastName.value}
        errors={lastName.errors}
        onChange={handleOnChange}
      ></InputField>
      <InputField
        name={FormInputField.Email}
        label="Email"
        value={email.value}
        errors={email.errors}
        onChange={handleOnChange}
      ></InputField>
      <InputField
        name={FormInputField.Birthday}
        label="Birthday"
        value={birthday.value}
        errors={birthday.errors}
        onChange={handleOnChange}
      ></InputField>
      <InputField
        name={FormInputField.City}
        label="City"
        value={city.value}
        errors={city.errors}
        onChange={handleOnChange}
      ></InputField>
      <InputField
        name={FormInputField.Zip}
        label="Zip"
        value={zip.value}
        errors={zip.errors}
        onChange={handleOnChange}
      ></InputField>
      <SubmitForm isDisabled={!isFormValid} onCancel={onCancel}></SubmitForm>
    </form>
  );
}
