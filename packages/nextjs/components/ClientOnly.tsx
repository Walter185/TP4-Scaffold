// components/ClientOnly.tsx
"use client";

import dynamic from "next/dynamic";

// components/ClientOnly.tsx

// components/ClientOnly.tsx

// components/ClientOnly.tsx

// components/ClientOnly.tsx

// components/ClientOnly.tsx

// components/ClientOnly.tsx

// components/ClientOnly.tsx

// components/ClientOnly.tsx

// components/ClientOnly.tsx

// components/ClientOnly.tsx

const ClientProviders = dynamic(() => import("~~/components/ClientProviders").then(mod => mod.ClientProviders), {
  ssr: false,
});

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
