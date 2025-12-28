import { InstitutionsPage } from "@/app/pages/Institutions";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <main className="flex-1 p-6 lg:p-8 mt-16 lg:mt-0">
        <InstitutionsPage searchParams={searchParams} />
      </main>
    </div>
  );
}
