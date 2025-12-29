import { Filter } from "@/components/Filter";
import { InstitutionCard } from "@/components/InstitutionCard";
import { Search } from "@/components/Search";
import { getInstitutions } from "@/lib/institution-service";
import { transformInstitution } from "@/lib/transformers";
import { filterInstitutions } from "@/lib/utils";

export const InstitutionsPage = async (props: {
  searchParams: Promise<{ query?: string; type?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query?.toLowerCase() || "";
  const typeFilter = searchParams?.type;

  const allInstitutions = await getInstitutions();

  const filteredInstitutions = filterInstitutions(
    allInstitutions,
    query,
    typeFilter
  );

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
        {filteredInstitutions.map((inst) => (
          <InstitutionCard key={inst._id} data={transformInstitution(inst)} />
        ))}
      </div>
    </div>
  );
};
