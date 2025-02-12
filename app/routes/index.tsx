import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "~/components/header";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="bg-background relative flex min-h-svh flex-col">
      <div className="border-border flex flex-1 flex-col">
        <Header />
        <main className="flex flex-1 flex-col">
          <div className="border-border 3xl:border-l 3xl:border-r mx-auto max-w-[102rem]">
            <div className="container mx-auto">
              <section className="mx-auto flex max-w-2xl flex-col justify-center space-y-4 px-4 py-24">
                <h1 className="text-center text-5xl font-bold text-balance">
                  Make your code snippets look better
                </h1>
                <p className="text-muted-foreground text-center text-xl text-balance">
                  Create beautiful code snippets in language of your choice and
                  share it with your friends
                </p>
                <Link
                  to="/generate"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mx-auto max-w-fit text-lg",
                  )}
                >
                  Create Snippet
                </Link>
              </section>
            </div>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
