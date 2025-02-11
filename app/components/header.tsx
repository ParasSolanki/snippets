import { Link } from "@tanstack/react-router";
import { Github as GithubIcon } from "lucide-react";
import { buttonVariants } from "./ui/button";

export function Header() {
  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="border-border 3xl:border-l 3xl:border-r mx-auto max-w-[102rem]">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
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
          <div className="flex items-center space-x-4">
            <a
              target="_blank"
              href="https://github.com/ParasSolanki/snippets"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "icon", variant: "ghost" })}
            >
              <GithubIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
