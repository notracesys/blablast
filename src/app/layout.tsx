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
      </head>
      <body className="font-body antialiased selection:bg-junino-yellow selection:text-black">
        {children}
      </body>
    </html>
  );
}