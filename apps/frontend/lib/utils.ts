import { InstitutionDTO } from "@/lib/dtos";

export function filterInstitutions(
  institutions: InstitutionDTO[],
  query: string,
  type: string | undefined
): InstitutionDTO[] {
  const normalizedQuery = query.toLowerCase();

  return institutions.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(normalizedQuery) ||
      inst.country.toLowerCase().includes(normalizedQuery);

    // Case-insensitive comparison for productType with null/undefined handling
    const matchesType =
      type && type !== "all"
        ? inst.productType?.toLowerCase() === type.toLowerCase()
        : true;

    return matchesSearch && matchesType;
  });
}
