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

    const matchesType =
      type && type !== "all" ? inst.productType === type : true;

    return matchesSearch && matchesType;
  });
}
