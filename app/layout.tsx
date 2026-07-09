import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
    title: 'HydroSmart — IoT Smart Hydroponic System',
    description:
        'Sistem hidroponik pintar berbasis IoT yang bisa kamu kontrol lewat smartphone. Cocok untuk pemula, otomatis, dan anti-gagal. Pre-order sekarang.',
    keywords: ['hidroponik', 'IoT', 'smart hydroponic', 'tanaman', 'otomatis', 'HydroSmart'],
    openGraph: {
        title: 'HydroSmart — IoT Smart Hydroponic System',
        description: 'Tanam sayur sendiri di rumah — otomatis, pintar, dan mudah.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id" className="scroll-smooth">
            <head>
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-KJGP9TFGV5"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-KJGP9TFGV5');
                    `}
                </Script>
            </head>
            <body className="font-body antialiased">{children}</body>
        </html>
    )
}
