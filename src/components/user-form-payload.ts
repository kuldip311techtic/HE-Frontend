import type { UserFormValues } from "@/components/UserForm";
import { splitFullName } from "@/lib/utils";

export function buildCreateUserPayload(values: UserFormValues) {
  const { first_name, last_name } = splitFullName(values.name);
  return {
    first_name,
    last_name,
    name: values.name.trim(),
    email: values.email.trim(),
    password: values.password,
    role: values.role,
  };
}

export function buildUpdateUserPayload(values: UserFormValues) {
  const { first_name, last_name } = splitFullName(values.name);
  const payload: {
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    role: string;
    password?: string;
  } = {
    first_name,
    last_name,
    name: values.name.trim(),
    email: values.email.trim(),
    role: values.role,
  };
  if (values.password?.trim()) {
    payload.password = values.password.trim();
  }
  return payload;
}
