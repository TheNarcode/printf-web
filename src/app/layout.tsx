import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../theme/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { PrintJobProvider } from '../context/PrintJobContext';
import { AlertProvider } from '../context/AlertContext';


const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'printf',
  description: 'Upload your documents, customize print settings, and get them printed. Fast and easy.',
  keywords: ['print', 'document printing', 'online print', 'pdf print'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Razorpay JS SDK */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="min-h-dvh flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
        <ThemeProvider>
          <AlertProvider>
            <AuthProvider>
              <PrintJobProvider>
                {children}
              </PrintJobProvider>
            </AuthProvider>
          </AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
