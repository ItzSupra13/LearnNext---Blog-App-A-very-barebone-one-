import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Link from "next/link";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={``}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="mx-auto w-full max-w-7xl sm:px-6 lg:px-8">
            <Button variant="ghost" asChild>
              <Link href="/">← Back to Home</Link>
            </Button>
            <section className="pt-4">
              {children}
            </section>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}