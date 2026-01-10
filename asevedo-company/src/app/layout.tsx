/**
 * Root Layout (passthrough)
 * This layout acts as a passthrough for the locale-specific layout
 * All rendering logic is handled in [locale]/layout.tsx
 */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
