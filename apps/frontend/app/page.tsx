import { InstitutionsPage } from "@/app/pages/Institutions";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const query =
    typeof resolvedParams.query === "string" ? resolvedParams.query : undefined;
  const type =
    typeof resolvedParams.type === "string" ? resolvedParams.type : undefined;

  const cleanParams = Promise.resolve({ query, type });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <main className="flex-1 p-6 lg:p-8 mt-16 lg:mt-0">
        <InstitutionsPage searchParams={cleanParams} />
      </main>
    </div>
  );
}
