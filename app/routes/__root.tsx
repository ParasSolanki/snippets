import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary";
import { NotFound } from "~/components/not-found";
import globalCss from "~/styles/global.css?url";
import * as React from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Snippets",
      },
      {
        name: "description",
        content: "Make your code snippets look better",
      },
      {
        name: "keywords",
        content: "code snippets, code, snippets, code snippets generator",
      },
      {
        name: "og:title",
        content: "Snippets",
      },
      {
        name: "og:description",
        content: "Make your code snippets look better",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Snippets",
      },
      {
        name: "twitter:description",
        content: "Make your code snippets look better",
      },
    ],
    links: [
      { rel: "stylesheet", href: globalCss },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/IBMPlexMono-Regular.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/IBMPlexMono-Medium.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/IBMPlexMono-SemiBold.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/IBMPlexMono-Bold.woff2",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: RootComponent,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Meta />
      </head>
      <body className="bg-background text-foreground selection:bg-primary antialiased selection:text-white/90">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
