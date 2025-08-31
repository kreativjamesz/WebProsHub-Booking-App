import { Navigation } from "@/components/Navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="min-h-[calc(100vh-70px)] bg-background">{children}</main>
    </div>
  );
}
