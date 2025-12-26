import { Navbar } from "@/components/web/Navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";

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
          <main className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
            <Navbar />
            <section className="pt-4">
              {children}
            </section>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}