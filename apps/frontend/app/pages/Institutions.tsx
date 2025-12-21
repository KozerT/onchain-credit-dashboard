import { Button } from "@repo/ui/button";

export const Institutions = () => {
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
          <div>Search Component goes here</div>
          <div>Filter Component will be here</div>
          {/* Institution Grid  */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            Institution Grid
          </div>
          <Button>Load More</Button>
        </div>
      </div>
    </div>
  );
};
