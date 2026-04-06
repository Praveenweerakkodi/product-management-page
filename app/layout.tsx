import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ProductProvider } from "@/context/ProductContext";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProductHub — Product Management Console",
  description:
    "A clean, fast product management dashboard. Add, edit, search, and organize your product catalog effortlessly.",
  keywords: ["product management", "catalog", "dashboard", "admin"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ProductProvider>
            <div className="min-h-screen bg-background flex">
              {/* Sidebar — desktop only */}
              <Sidebar />

              {/* Main content */}
              <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {children}
              </div>
            </div>

            {/* Toast notifications */}
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                duration: 3500,
                classNames: {
                  toast: "font-sans text-sm",
                },
              }}
            />
          </ProductProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
