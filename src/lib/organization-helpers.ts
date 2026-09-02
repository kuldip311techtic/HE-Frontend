import type { Organization } from "@/types/organization";

export function getOrganizationName(organization: Organization): string {
  return organization.name || organization.organization || "Unnamed organization";
}

export function getOrganizationContactEmail(organization: Organization): string {
  return organization.contact_email || organization.email || "—";
}

export function getOrganizationPhone(organization: Organization): string {
  return organization.phone_number || organization.phone || "—";
}

export function organizationToFormValues(
  organization: Organization,
): {
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
} {
  return {
    name: organization.name || organization.organization || "",
    contact_email: organization.contact_email || organization.email || "",
    phone_number: organization.phone_number || organization.phone || "",
    address: organization.address || "",
  };
}
