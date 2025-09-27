import ClientProviders from "./ClientProviders";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <ClientProviders>{children}</ClientProviders>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
