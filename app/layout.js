import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Next Blog",
  description: "Simple blog app with auth + CRUD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ filter: "invert(0)" }}>
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
