// components/ClientProviders.tsx
"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";

// components/ClientProviders.tsx

// components/ClientProviders.tsx

// components/ClientProviders.tsx

// components/ClientProviders.tsx

// components/ClientProviders.tsx

// components/ClientProviders.tsx

// components/ClientProviders.tsx

// components/ClientProviders.tsx

// components/ClientProviders.tsx

// components/ClientProviders.tsx

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem>
      <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
    </ThemeProvider>
  );
}
