import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NavigationLoadingProvider } from "@/components/NavigationLoading";

export const metadata: Metadata = {
  title: "PPI Repository",
  description: "Process Performance Indicators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavigationLoadingProvider>
          <Navbar />
          {children}
          <Footer />
        </NavigationLoadingProvider>
      </body>
    </html>
  );
}
