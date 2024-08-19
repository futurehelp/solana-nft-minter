import "./globals.css"; // Assuming your global styles are here
import WalletProvider from "../components/WalletProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
