import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BottomNav } from "../components/BottomNav";
import { ResetButton } from "../components/ResetButton";
import { ViewToggle } from "../components/ViewToggle";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="cute-card max-w-sm p-8 text-center">
        <div className="mb-2 text-6xl">🌱</div>
        <h1 className="text-2xl font-black text-foreground">Lost in the grove</h1>
        <p className="mt-2 text-sm font-bold text-muted-foreground">
          That page hasn't sprouted yet.
        </p>
        <Link to="/" className="cute-button mt-5 inline-block">Back home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="cute-card max-w-sm p-8 text-center">
        <div className="mb-2 text-6xl">🍂</div>
        <h1 className="text-xl font-black">Something wilted</h1>
        <p className="mt-2 text-sm font-bold text-muted-foreground">
          Give it a little water and try again.
        </p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="cute-button mt-5"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sprout Quest — Grow yourself, grow your grove" },
      { name: "description", content: "A cozy RPG health companion for young people. Build healthy habits, raise an avatar, and grow a living grove." },
      { name: "author", content: "Sprout Quest" },
      { property: "og:title", content: "Sprout Quest" },
      { property: "og:description", content: "Grow yourself, grow your grove." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
        <main className="flex-1 pb-2">
          <Outlet />
        </main>
        <ResetButton />
        <ViewToggle />

        <BottomNav />
      </div>
    </QueryClientProvider>
  );
}
