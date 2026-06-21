import { Link, useRouterState } from "@tanstack/react-router";
import iconHome from "@/assets/icon-home.png";
import iconGrove from "@/assets/icon-grove.png";
import iconJournal from "@/assets/icon-journal.png";
import iconFriends from "@/assets/icon-friends.png";
import iconQuests from "@/assets/icon-quests.png";
import iconShop from "@/assets/icon-shop.png";

const tabs = [
  { to: "/", label: "Home", icon: iconHome },
  { to: "/quests", label: "Quests", icon: iconQuests },
  { to: "/grove", label: "Grove", icon: iconGrove },
  { to: "/journal", label: "Journal", icon: iconJournal },
  { to: "/friends", label: "Friends", icon: iconFriends },
  { to: "/shop", label: "Shop", icon: iconShop },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky bottom-0 z-30 px-3 pb-3 pt-2">
      <ul className="mx-auto flex max-w-md items-stretch justify-between rounded-3xl border border-border bg-card/95 px-2 py-2 shadow-[0_8px_24px_-8px_oklch(0.5_0.1_280/0.2)] backdrop-blur">
        {tabs.map(({ to, label, icon }) => {
          const active = pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-label={label}
                className={`group relative flex flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 ${active ? "nav-tab-active" : ""}`}
              >
                <img src={icon} alt="" className="nav-icon" width={32} height={32} loading="lazy" />
                {active && (
                  <span
                    className="absolute -bottom-0.5 h-1 w-6 rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
