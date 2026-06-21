@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 6px);
  --radius-2xl: calc(var(--radius) + 12px);
  --radius-3xl: calc(var(--radius) + 20px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-dark: var(--primary-dark);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-leaf: var(--leaf);
  --color-leaf-foreground: var(--leaf-foreground);
  --color-sky: var(--sky);
  --color-sky-foreground: var(--sky-foreground);
  --color-sun: var(--sun);
  --color-sun-foreground: var(--sun-foreground);
  --color-berry: var(--berry);
  --color-berry-foreground: var(--berry-foreground);
  --color-bark: var(--bark);
  --color-bark-foreground: var(--bark-foreground);

  --font-display: "Plus Jakarta Sans", system-ui, sans-serif;
  --font-sans: "Plus Jakarta Sans", system-ui, sans-serif;
}

:root {
  --radius: 1.25rem;

  /* Warm paper background — terracotta & sage palette */
  --background: oklch(0.97 0.012 70);
  --foreground: oklch(0.26 0.04 50);

  --card: oklch(0.995 0.006 70);
  --card-foreground: oklch(0.26 0.04 50);
  --popover: oklch(0.995 0.006 70);
  --popover-foreground: oklch(0.26 0.04 50);

  /* Terracotta primary (#c4654a) */
  --primary: oklch(0.60 0.13 35);
  --primary-foreground: oklch(0.99 0.01 70);
  --primary-dark: oklch(0.48 0.14 35);

  --secondary: oklch(0.93 0.025 75);
  --secondary-foreground: oklch(0.32 0.06 45);

  --muted: oklch(0.94 0.015 80);
  --muted-foreground: oklch(0.5 0.04 60);

  /* Sage accent (#87a878) */
  --accent: oklch(0.92 0.035 135);
  --accent-foreground: oklch(0.34 0.07 135);

  --destructive: oklch(0.62 0.2 28);
  --destructive-foreground: oklch(0.99 0.01 70);

  --border: oklch(0.9 0.02 75);
  --input: oklch(0.93 0.018 75);
  --ring: oklch(0.60 0.13 35);

  /* Botanical palette */
  --leaf: oklch(0.78 0.07 135);
  --leaf-foreground: oklch(0.3 0.07 135);
  --sky: oklch(0.88 0.04 220);
  --sky-foreground: oklch(0.32 0.08 230);
  --sun: oklch(0.88 0.1 75);
  --sun-foreground: oklch(0.4 0.1 60);
  --berry: oklch(0.78 0.11 25);
  --berry-foreground: oklch(0.34 0.13 25);
  --bark: oklch(0.46 0.07 50);
  --bark-foreground: oklch(0.98 0.01 70);
}

@layer base {
  * {
    border-color: var(--color-border);
  }
  html, body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    font-weight: 600;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4 {
    font-weight: 800;
    letter-spacing: -0.015em;
  }
}

@layer components {
  /* Soft floating card */
  .cute-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 1.5rem;
    box-shadow: 0 4px 16px -8px oklch(0.48 0.1 40 / 0.18);
  }
  .cute-pill {
    border-radius: 999px;
    padding: 0.3rem 0.7rem;
    font-weight: 700;
    font-size: 0.7rem;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
  /* Primary CTA — terracotta gradient */
  .cute-button {
    border-radius: 1rem;
    border: none;
    background: linear-gradient(180deg, oklch(0.68 0.13 38), oklch(0.52 0.15 32));
    color: var(--primary-foreground);
    font-weight: 700;
    padding: 0.85rem 1.2rem;
    box-shadow: 0 8px 20px -8px oklch(0.5 0.15 35 / 0.5), inset 0 1px 0 0 oklch(1 0 0 / 0.25);
    transition: transform 0.08s, box-shadow 0.08s, filter 0.15s;
    font-size: 0.9rem;
    letter-spacing: -0.01em;
  }
  .cute-button:hover { filter: brightness(1.05); }
  .cute-button:active {
    transform: translateY(1px);
    box-shadow: 0 4px 12px -6px oklch(0.5 0.15 35 / 0.45);
  }

  /* Botanical sticker nav icon */
  .nav-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
    filter: drop-shadow(0 2px 3px oklch(0.4 0.08 40 / 0.22));
    transition: transform 0.15s;
  }
  .nav-tab-active .nav-icon { transform: translateY(-2px) scale(1.1); }
}
