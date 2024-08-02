import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/app/AuthContext';

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "Inventory Management App",
  description: "A modern inventory management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
