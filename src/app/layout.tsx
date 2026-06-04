import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arraiá Gigante - Painel 3 Metros para Impressão',
  description: 'Decoração profissional de Festa Junina em casa. Arquivo digital de painel gigante de 3m x 2.5m.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Utmify Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.pixelId = "6a11d232473d2c2b983812d8";
              var a = document.createElement("script");
              a.setAttribute("async", "");
              a.setAttribute("defer", "");
              a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
              document.head.appendChild(a);
            `,
          }}
        />

        {/* Utmify Tracking Script */}
        <script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck
          data-utmify-prevent-subids
          async
          defer
        ></script>
      </head>
      <body className="font-body antialiased selection:bg-junino-yellow selection:text-black">
        {children}
      </body>
    </html>
  );
}
