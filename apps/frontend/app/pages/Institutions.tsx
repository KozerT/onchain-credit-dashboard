import { Filter } from "@/components/Filter";
import { InstitutionCard } from "@/components/InstitutionCard";
import { Search } from "@/components/Search";
import { components } from "@/lib/api-types";

async function getInstitutions() {
  const baseUrl = process.env.INTERNAL_API_URL || "http://localhost:3001";
  const res = await fetch(`${baseUrl}/api/institutions`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json() as Promise<components["schemas"]["Institution"][]>;
}

export const InstitutionsPage = async (props: {
  searchParams: Promise<{ query?: string; type?: string }>;
}) => {
  const searchParams = await props.searchParams;

  const allInstitutions = await getInstitutions();

  const query = searchParams?.query?.toLowerCase() || "";
  const typeFilter = searchParams?.type;

  const filterInstitutions = allInstitutions.filter((inst) => {
    // Search logic (Name or Country)
    const matchesSearch =
      inst.name.toLowerCase().includes(query) ||
      inst.country.toLowerCase().includes(query);

    // Filter Logic (Strictly match the API Enum)
    const matchesType =
      typeFilter && typeFilter !== "all"
        ? inst.productType === typeFilter
        : true;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Credit Institutions</h1>
        <p className="text-muted-foreground">
          Discover and invest in tokenized real-world credit assets
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 w-full sm:w-auto">
          <Search />
        </div>
        <div className="w-full sm:w-auto">
          <Filter />
        </div>
      </div>

      {/* Institution Grid  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filterInstitutions.map((inst) => (
          <InstitutionCard key={inst._id} data={inst} />
        ))}
      </div>
    </div>
  );
};
