import { InstitutionCard } from "@/components/InstitutionCard";
import { Search } from "@/components/Search";
import { components } from "@/lib/api-types";
import { Button } from "@repo/ui/button";

async function getInstitutions() {
  const res = await fetch("http://localhost:3001/api/institutions", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch institutions");
  }

  const data: components["schemas"]["Institution"][] = await res.json();
  return data;
}

export const InstitutionsPage = async () => {
  const institutions = await getInstitutions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Credit Institutions</h1>
        <p className="text-muted-foreground">
          Discover and invest in tokenized real-world credit assets
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          {" "}
          <Search />
          <div>Filter Component will be here</div>
          {/* Institution Grid  */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {institutions.map((inst) => (
              <InstitutionCard key={inst._id} data={inst} />
            ))}
          </div>
          <Button>Load More</Button>
        </div>
      </div>
    </div>
  );
};
