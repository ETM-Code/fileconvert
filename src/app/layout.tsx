import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Bricolage_Grotesque, Figtree, Fira_Code } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const firaCodeFiraCode = Fira_Code({subsets:['cyrillic','cyrillic-ext','greek','greek-ext','latin','latin-ext','symbols2'],weight:['300','400','500','600','700'],variable:'--font-fira-code'});

const figtreeFigtree = Figtree({subsets:['latin','latin-ext'],weight:['300','400','500','600','700','800','900'],variable:'--font-figtree'});

const bricolageGrotesqueBricolageGrotesque = Bricolage_Grotesque({subsets:['latin','latin-ext','vietnamese'],weight:['200','300','400','500','600','700','800'],variable:'--font-bricolage-grotesque'});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FileConvert",
  description: "Universal file converter. Runs entirely in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", dmSans.variable, jetbrainsMono.variable, bricolageGrotesqueBricolageGrotesque.variable, figtreeFigtree.variable, firaCodeFiraCode.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
