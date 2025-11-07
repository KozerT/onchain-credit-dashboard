// apps/frontend/app/page.tsx

// 1. ADD THIS LINE to make it a Client Component
"use client";

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

export default function Home() {
  // 2. ADD THIS FUNCTION to toggle the theme
  const toggleTheme = () => {
    // This adds or removes the 'dark' class from the <html> tag
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Testing the UI Package 👋</h1>

        <button
          onClick={toggleTheme}
          className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg border-2 border-primary"
        >
          Toggle Light/Dark Mode
        </button>

        {/* --- (Your existing test elements) --- */}
        <div className="flex flex-col gap-4">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
            Test Primary Button
          </button>

          <div className="bg-card text-card-foreground border border-border p-4 rounded-lg">
            <h3 className="font-bold">This is a Card</h3>
            <p className="text-muted-foreground">This is muted text.</p>
          </div>

          <div className="flex gap-4">
            <p className="text-destructive">Destructive</p>
            <p className="text-success">Success</p>
            <p className="text-warning">Warning</p>
          </div>
        </div>
      </main>
    </div>
  );
}
