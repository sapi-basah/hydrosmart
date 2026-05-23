import type { Metadata } from 'next'
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
            <body className="font-body antialiased">{children}</body>
        </html>
    )
}