import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ConditionalNavigation } from "@/components/cnditional-navigation";
import { RouteGuard } from "@/components/RouteGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace Booking App",
  description: "Book services from local businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <RouteGuard>
              <ConditionalNavigation />
              <main className="min-h-[calc(100vh-70px)] bg-background">
                {children}
              </main>
              <Toaster />
            </RouteGuard>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
