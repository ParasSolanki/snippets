import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="border-border 3xl:border-l 3xl:border-r mx-auto max-w-[102rem]">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Link to="/" className="text-primary text-2xl font-bold">
              Snippets
            </Link>
            <nav className="text-sm">
              <Link to="/generate" className="text-foreground">
                Generate
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
