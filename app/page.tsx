'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Wifi,
    Droplets,
    Leaf,
    Package,
    ChevronDown,
    CheckCircle2,
    AlertCircle,
    Sprout,
    Menu,
    X,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface FormData {
    name: string
    whatsapp: string
    email: string
}

interface FormState {
    loading: boolean
    success: boolean
    error: string | null
    orderId: string | null
}

// ─── Data ────────────────────────────────────────────────────────────────────
const features = [
    {
        icon: Wifi,
        title: 'Kendali Penuh via Aplikasi',
        description:
            'Monitor kadar nutrisi, jadwal penyiraman, dan kondisi tanaman secara real-time dari mana saja hanya lewat smartphone.',
        badge: 'IoT Connected',
    },
    {
        icon: Droplets,
        title: 'Pompa Otomatis Cerdas',
        description:
            'Sensor EC & pH presisi mengatur dosis nutrisi AB Mix secara otomatis. Tanaman selalu mendapat yang dibutuhkan — bahkan saat kamu sibuk.',
        badge: 'Auto Pump',
    },
    {
        icon: Leaf,
        title: 'Anti-Gagal untuk Pemula',
        description:
            'Panduan visual step-by-step di aplikasi, notifikasi pintar, dan template jadwal tanam. Tidak perlu jadi petani dulu.',
        badge: 'Beginner Friendly',
    },
]

const boxContents = [
    { label: 'Mini Installation Kit', desc: 'Frame & panel food-grade, siap rakit' },
    { label: '10× Netpots', desc: 'Ukuran standar, reusable' },
    { label: 'Rockwool Growing Media', desc: 'Pre-cut, steril, siap pakai' },
    { label: 'Benih Sayuran Pilihan', desc: 'Selada, kangkung, atau bayam' },
    { label: 'AB Mix Nutrisi 500ml', desc: 'Formula konsentrat premium' },
    { label: 'Pompa Air Mini DC', desc: 'Senyap, hemat listrik' },
    { label: 'IoT Smart Plug + Sensor', desc: 'WiFi ready, plug & play' },
]

const stats = [
    { value: '< 5 mnt', label: 'Setup time' },
    { value: '21 hari', label: 'Panen pertama' },
    { value: '90%', desc: 'Hemat air vs tanah', label: 'Hemat air' },
    { value: '24/7', label: 'Monitor otomatis' },
]

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useIntersectionObserver(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true) },
            { threshold }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [threshold])

    return { ref, visible }
}

// ─── Sub-Components ──────────────────────────────────────────────────────────
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
    const { ref, visible } = useIntersectionObserver()
    const Icon = feature.icon
    return (
        <div
            ref={ref}
            className="group p-8 rounded-2xl bg-white/5 border border-[#8DA399]/20 hover:bg-[#8DA399]/10 hover:border-[#8DA399]/50 transition-all duration-500 cursor-default"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s ease ${index * 120}ms, background-color 0.3s, border-color 0.3s`,
            }}
        >
            <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#8DA399]/20 flex items-center justify-center group-hover:bg-[#8DA399]/35 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#8DA399]" />
                </div>
                <span className="text-xs font-semibold tracking-widest uppercase text-[#8DA399]/60 bg-[#8DA399]/10 px-3 py-1 rounded-full border border-[#8DA399]/20">
                    {feature.badge}
                </span>
            </div>
            <h3 className="font-display text-xl font-bold text-[#FAF9F6] mb-3 leading-snug">
                {feature.title}
            </h3>
            <p className="text-[#8DA399]/75 leading-relaxed text-sm">{feature.description}</p>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
    const [formData, setFormData] = useState<FormData>({ name: '', whatsapp: '', email: '' })
    const [formState, setFormState] = useState<FormState>({
        loading: false,
        success: false,
        error: null,
        orderId: null,
    })
    const [mounted, setMounted] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToForm = () => {
        setMobileMenu(false)
        document.getElementById('preorder')?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormState({ loading: true, success: false, error: null, orderId: null })

        try {
            const res = await fetch('/api/preorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            const data = await res.json()

            if (!res.ok) {
                setFormState({ loading: false, success: false, error: data.message, orderId: null })
            } else {
                setFormState({ loading: false, success: true, error: null, orderId: data.orderId })
                setFormData({ name: '', whatsapp: '', email: '' })
            }
        } catch {
            setFormState({
                loading: false,
                success: false,
                error: 'Gagal terhubung ke server. Periksa koneksi internet kamu.',
                orderId: null,
            })
        }
    }

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <main className="bg-[#FAF9F6] min-h-screen text-[#2C3E35] font-body overflow-x-hidden">

            {/* ── NAVBAR ── */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FAF9F6]/90 backdrop-blur-md shadow-sm border-b border-[#8DA399]/15' : 'bg-transparent'
                    }`}
            >
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-[#2C3E35] tracking-tight">
                        Hydro<span className="text-[#8DA399]">Smart</span>
                    </span>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-[#5a7068] hover:text-[#2C3E35] transition-colors">
                            Fitur
                        </a>
                        <a href="#box" className="text-sm text-[#5a7068] hover:text-[#2C3E35] transition-colors">
                            Paket
                        </a>
                        <button
                            onClick={scrollToForm}
                            className="px-5 py-2.5 bg-[#8DA399] text-white text-sm font-semibold rounded-xl hover:bg-[#7a9188] transition-all duration-200 shadow-sm shadow-[#8DA399]/30"
                        >
                            Pre-Order
                        </button>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg text-[#2C3E35] hover:bg-[#8DA399]/10 transition-colors"
                        onClick={() => setMobileMenu((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile drawer */}
                {mobileMenu && (
                    <div className="md:hidden bg-[#FAF9F6] border-t border-[#8DA399]/15 px-6 py-6 flex flex-col gap-4">
                        <a href="#features" onClick={() => setMobileMenu(false)} className="text-[#2C3E35] font-medium">
                            Fitur
                        </a>
                        <a href="#box" onClick={() => setMobileMenu(false)} className="text-[#2C3E35] font-medium">
                            Paket
                        </a>
                        <button
                            onClick={scrollToForm}
                            className="w-full py-3 bg-[#8DA399] text-white font-semibold rounded-xl"
                        >
                            Pre-Order Sekarang
                        </button>
                    </div>
                )}
            </nav>

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#8DA399]/8 blur-3xl pointer-events-none translate-x-1/2" />
                <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-[#8DA399]/10 blur-3xl pointer-events-none -translate-x-1/2" />
                {/* Subtle grid texture */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.025]"
                    style={{
                        backgroundImage: `linear-gradient(#8DA399 1px, transparent 1px), linear-gradient(90deg, #8DA399 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                <div
                    className="relative max-w-3xl mx-auto text-center"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(32px)',
                        transition: 'opacity 0.8s ease, transform 0.8s ease',
                    }}
                >
                    {/* Badge */}
                    <div
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#8DA399]/12 text-[#6b8a7e] text-sm font-semibold mb-8 border border-[#8DA399]/25"
                        style={{ transitionDelay: '100ms' }}
                    >
                        <Sprout className="w-4 h-4" />
                        IoT Smart Hydroponic System
                        <span className="flex items-center gap-1 text-xs text-[#8DA399]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8DA399] animate-pulse" />
                            Pre-Order Open
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-display text-4xl md:text-5xl lg:text-[3.75rem] font-bold leading-[1.15] text-[#2C3E35] mb-6 text-balance">
                        Pengen nanam sayur sendiri di rumah tapi tanaman selalu layu karena{' '}
                        <em className="text-[#8DA399] not-italic">lupa nyiram?</em>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-[#5a7068] max-w-2xl mx-auto mb-10 leading-relaxed">
                        <strong className="text-[#2C3E35] font-semibold">HydroSmart</strong> mengotomasi penyiraman & nutrisi
                        lewat sistem IoT yang bisa kamu kontrol dari smartphone — kapan saja, di mana saja. Cocok untuk pemula,
                        anti-gagal, dan panen dalam 3 minggu.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={scrollToForm}
                            className="w-full sm:w-auto px-8 py-4 bg-[#8DA399] text-white font-semibold rounded-xl hover:bg-[#7a9188] active:scale-95 transition-all duration-200 shadow-lg shadow-[#8DA399]/30 text-base"
                        >
                            Pre-Order Sekarang →
                        </button>
                        <a
                            href="#features"
                            className="w-full sm:w-auto px-8 py-4 border-2 border-[#8DA399]/35 text-[#2C3E35] font-semibold rounded-xl hover:border-[#8DA399]/70 hover:bg-[#8DA399]/5 transition-all duration-200 text-base text-center"
                        >
                            Lihat Fitur
                        </a>
                    </div>
                </div>

                {/* Scroll hint */}
                <a
                    href="#features"
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8DA399]/40 hover:text-[#8DA399]/70 transition-colors"
                >
                    <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                </a>
            </section>

            {/* ── STATS STRIP ── */}
            <section className="bg-[#8DA399]/10 border-y border-[#8DA399]/20 py-8 px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center">
                            <p className="font-display text-3xl md:text-4xl font-bold text-[#2C3E35]">{s.value}</p>
                            <p className="text-sm text-[#5a7068] mt-1 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" className="py-24 px-6 bg-[#2C3E35]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-[#8DA399] text-sm font-semibold tracking-widest uppercase mb-3">
                            Teknologi HydroSmart
                        </p>
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#FAF9F6] mb-5">
                            Kenapa HydroSmart?
                        </h2>
                        <p className="text-[#8DA399]/75 text-lg max-w-xl mx-auto leading-relaxed">
                            Teknologi greenhouse modern kini hadir dalam ukuran yang muat di dapur kamu.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <FeatureCard key={i} feature={f} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHAT'S IN THE BOX ── */}
            <section id="box" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Left: text */}
                        <div>
                            <p className="text-[#8DA399] text-sm font-semibold tracking-widest uppercase mb-3">
                                Starter Kit
                            </p>
                            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3E35] mb-5 leading-tight">
                                Satu Kotak,<br />
                                <span className="text-[#8DA399]">Semua yang Kamu Butuhkan.</span>
                            </h2>
                            <p className="text-[#5a7068] text-lg mb-10 leading-relaxed">
                                Buka kotak, rakit dalam 5 menit, ikuti panduan di aplikasi — dan sayuran pertamamu siap
                                tumbuh tanpa pengalaman sebelumnya.
                            </p>

                            <ul className="space-y-3.5">
                                {boxContents.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-4 group p-3.5 rounded-xl hover:bg-[#8DA399]/8 transition-colors cursor-default"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#8DA399]/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#8DA399]/25 transition-colors mt-0.5">
                                            <span className="text-[#8DA399] text-xs font-bold">
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[#2C3E35] font-semibold text-sm">{item.label}</p>
                                            <p className="text-[#5a7068] text-sm mt-0.5">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right: box mockup */}
                        <div className="relative flex items-center justify-center">
                            {/* Outer glow */}
                            <div className="absolute inset-0 rounded-3xl bg-[#8DA399]/10 blur-2xl scale-90" />

                            <div className="relative w-full max-w-sm aspect-square rounded-3xl border-2 border-dashed border-[#8DA399]/30 bg-[#8DA399]/5 flex flex-col items-center justify-center p-10 text-center">
                                {/* Corner dots */}
                                {['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2'].map((pos, i) => (
                                    <div key={i} className={`absolute ${pos} w-4 h-4 rounded-full bg-[#8DA399]/40`} />
                                ))}

                                <Package className="w-20 h-20 text-[#8DA399]/35 mb-5" strokeWidth={1} />

                                <p className="font-display text-3xl font-bold text-[#2C3E35] mb-1">
                                    Hydro<span className="text-[#8DA399]">Smart</span>
                                </p>
                                <p className="text-[#5a7068] text-sm mb-1 font-medium">Starter Kit v1.0</p>
                                <p className="text-[#8DA399]/60 text-xs mb-7">IoT Smart Hydroponic System</p>

                                <div className="px-5 py-2.5 bg-[#8DA399] rounded-full">
                                    <span className="text-white text-sm font-semibold">✦ Gratis Ongkir Se-Indonesia</span>
                                </div>

                                <p className="text-[#5a7068]/60 text-xs mt-4">*Selama masa pre-order</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PRE-ORDER FORM ── */}
            <section id="preorder" className="py-24 px-6 bg-[#2C3E35] relative overflow-hidden">
                {/* bg decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#8DA399]/5 blur-3xl pointer-events-none" />

                <div className="relative max-w-lg mx-auto">
                    {/* Heading */}
                    <div className="text-center mb-12">
                        <p className="text-[#8DA399] text-sm font-semibold tracking-widest uppercase mb-3">
                            Stok Terbatas
                        </p>
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#FAF9F6] mb-5">
                            Amankan Unit Kamu
                        </h2>
                        <p className="text-[#8DA399]/70 text-lg leading-relaxed">
                            Daftarkan dirimu sekarang dan tim kami akan menghubungi via WhatsApp untuk konfirmasi
                            dan info harga pre-order eksklusif.
                        </p>
                    </div>

                    {/* Success State */}
                    {formState.success ? (
                        <div className="text-center p-10 rounded-2xl bg-[#FAF9F6]/5 border border-[#8DA399]/30">
                            <div className="w-20 h-20 rounded-full bg-[#8DA399]/20 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-[#8DA399]" />
                            </div>
                            <h3 className="font-display text-2xl font-bold text-[#FAF9F6] mb-3">
                                Pendaftaran Berhasil! 🌱
                            </h3>
                            <p className="text-[#8DA399]/75 mb-2 leading-relaxed">
                                Terima kasih! Tim HydroSmart akan segera menghubungi kamu via WhatsApp untuk konfirmasi
                                pre-order.
                            </p>
                            {formState.orderId && (
                                <p className="text-[#8DA399]/50 text-sm mb-6">
                                    Order ID:{' '}
                                    <code className="font-mono bg-[#8DA399]/10 px-2 py-0.5 rounded text-[#8DA399]">
                                        {formState.orderId}
                                    </code>
                                </p>
                            )}
                            <button
                                onClick={() => setFormState({ loading: false, success: false, error: null, orderId: null })}
                                className="text-sm text-[#8DA399] hover:text-[#a8bcb5] underline underline-offset-4 transition-colors"
                            >
                                Daftarkan email lain
                            </button>
                        </div>
                    ) : (
                        /* Form */
                        <form
                            onSubmit={handleSubmit}
                            className="bg-[#FAF9F6] rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/30 space-y-6"
                            noValidate
                        >
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-[#2C3E35] mb-2">
                                    Nama Lengkap <span className="text-[#8DA399]">*</span>
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Nama lengkap kamu..."
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 rounded-xl border border-[#8DA399]/25 bg-[#FAF9F6] text-[#2C3E35] placeholder:text-[#9aafa9] focus:outline-none focus:ring-2 focus:ring-[#8DA399]/40 focus:border-[#8DA399] transition-all duration-200 text-sm"
                                />
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <label htmlFor="whatsapp" className="block text-sm font-semibold text-[#2C3E35] mb-2">
                                    Nomor WhatsApp <span className="text-[#8DA399]">*</span>
                                </label>
                                <input
                                    id="whatsapp"
                                    name="whatsapp"
                                    type="tel"
                                    autoComplete="tel"
                                    placeholder="08xxxxxxxxxx"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 rounded-xl border border-[#8DA399]/25 bg-[#FAF9F6] text-[#2C3E35] placeholder:text-[#9aafa9] focus:outline-none focus:ring-2 focus:ring-[#8DA399]/40 focus:border-[#8DA399] transition-all duration-200 text-sm"
                                />
                                <p className="text-xs text-[#9aafa9] mt-1.5">Format: 08xxx atau +628xxx</p>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-[#2C3E35] mb-2">
                                    Email <span className="text-[#8DA399]">*</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="email@kamu.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 rounded-xl border border-[#8DA399]/25 bg-[#FAF9F6] text-[#2C3E35] placeholder:text-[#9aafa9] focus:outline-none focus:ring-2 focus:ring-[#8DA399]/40 focus:border-[#8DA399] transition-all duration-200 text-sm"
                                />
                            </div>

                            {/* Error alert */}
                            {formState.error && (
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{formState.error}</span>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={formState.loading}
                                className="w-full py-4 bg-[#8DA399] text-white font-semibold rounded-xl hover:bg-[#7a9188] active:scale-[0.98] transition-all duration-200 shadow-md shadow-[#8DA399]/30 disabled:opacity-60 disabled:cursor-not-allowed text-base"
                            >
                                {formState.loading ? (
                                    <span className="flex items-center justify-center gap-2.5">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Mengirim...
                                    </span>
                                ) : (
                                    'Daftarkan Pre-Order →'
                                )}
                            </button>

                            <p className="text-center text-xs text-[#9aafa9]">
                                🔒 Data kamu aman & tidak akan dibagikan ke pihak manapun.
                                <br />
                                Kami hanya menghubungi untuk konfirmasi pre-order.
                            </p>
                        </form>
                    )}
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="py-12 px-6 bg-[#FAF9F6] border-t border-[#8DA399]/15">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="font-display text-2xl font-bold text-[#2C3E35]">
                            Hydro<span className="text-[#8DA399]">Smart</span>
                        </p>
                        <p className="text-[#5a7068] text-sm mt-1">IoT Smart Hydroponic System</p>
                    </div>

                    <div className="flex items-center gap-8 text-sm text-[#5a7068]">
                        <a href="#features" className="hover:text-[#2C3E35] transition-colors">Fitur</a>
                        <a href="#box" className="hover:text-[#2C3E35] transition-colors">Paket</a>
                        <a href="#preorder" className="hover:text-[#2C3E35] transition-colors">Pre-Order</a>
                    </div>

                    <p className="text-[#9aafa9] text-xs text-center md:text-right">
                        © {new Date().getFullYear()} HydroSmart. All rights reserved.
                        <br />
                        Dibuat dengan 🌿 untuk ujian tengah semester.
                    </p>
                </div>
            </footer>
        </main>
    )
}