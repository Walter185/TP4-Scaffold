// app/layout.tsx
import ClientOnly from "~~/components/ClientOnly";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "EthKipu SimpleSwap",
  description: "Front‑end for SimpleSwap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>
        {/* Esto es un Server Component, aquí NO ponemos imports de web3 ni dynamic(ssr:false) */}
        <ClientOnly>{children}</ClientOnly>
      </body>
    </html>
  );
}
