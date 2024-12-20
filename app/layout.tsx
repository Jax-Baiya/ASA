import "./globals.css";

export const metadata = {
  title: "ASA - Affiliate System Automation",
  description: "Affiliate System Automation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
