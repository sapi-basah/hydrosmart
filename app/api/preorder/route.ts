import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// ─── In-Memory Mock Database ───────────────────────────────────────────────
// This array persists as long as the server is running.
// For production, replace with a real database (e.g. Prisma + PostgreSQL).
const preorders: PreorderEntry[] = []

interface PreorderEntry {
    id: string
    name: string
    whatsapp: string
    email: string
    createdAt: string
}

// ─── Helper: Persist to local JSON file (optional, for dev inspection) ─────
function persistToFile(data: PreorderEntry[]) {
    try {
        const filePath = path.join(process.cwd(), 'data', 'preorders.json')
        const dir = path.dirname(filePath)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch {
        // Non-fatal — file persistence is best-effort
        console.warn('[HydroSmart] Could not write preorders.json')
    }
}

// ─── Validators ─────────────────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidWhatsApp(number: string): boolean {
    // Accepts: 08xxxxxxxxxx  or  +628xxxxxxxxxx  (10-15 digits)
    return /^(\+62|08)[0-9]{8,13}$/.test(number.trim())
}

// ─── POST /api/preorder ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, whatsapp, email } = body

        // ── Field presence validation ──────────────────────────────────────────
        const missing: string[] = []
        if (!name?.trim()) missing.push('Nama')
        if (!whatsapp?.trim()) missing.push('Nomor WhatsApp')
        if (!email?.trim()) missing.push('Email')

        if (missing.length > 0) {
            return NextResponse.json(
                { success: false, message: `Field berikut wajib diisi: ${missing.join(', ')}.` },
                { status: 400 }
            )
        }

        // ── Format validation ──────────────────────────────────────────────────
        if (!isValidEmail(email.trim())) {
            return NextResponse.json(
                { success: false, message: 'Format email tidak valid.' },
                { status: 400 }
            )
        }

        if (!isValidWhatsApp(whatsapp.trim())) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Format nomor WhatsApp tidak valid. Gunakan format 08xxx atau +628xxx.',
                },
                { status: 400 }
            )
        }

        // ── Duplicate check (same email or same WA number) ─────────────────────
        const duplicate = preorders.find(
            (p) => p.email === email.trim().toLowerCase() || p.whatsapp === whatsapp.trim()
        )
        if (duplicate) {
            return NextResponse.json(
                { success: false, message: 'Nomor WhatsApp atau Email ini sudah terdaftar.' },
                { status: 409 }
            )
        }

        // ── Store entry ────────────────────────────────────────────────────────
        const newEntry: PreorderEntry = {
            id: `HS-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
            name: name.trim(),
            whatsapp: whatsapp.trim(),
            email: email.trim().toLowerCase(),
            createdAt: new Date().toISOString(),
        }

        preorders.push(newEntry)
        persistToFile(preorders)

        console.log(`[HydroSmart] New pre-order #${preorders.length}: ${newEntry.id} — ${newEntry.name}`)

        return NextResponse.json(
            {
                success: true,
                message: 'Pre-order berhasil! Kami akan segera menghubungi kamu via WhatsApp.',
                orderId: newEntry.id,
                totalOrders: preorders.length,
            },
            { status: 201 }
        )
    } catch (err) {
        console.error('[HydroSmart] API error:', err)
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server. Coba beberapa saat lagi.' },
            { status: 500 }
        )
    }
}

// ─── GET /api/preorder (admin overview — remove or protect in production) ────
export async function GET() {
    return NextResponse.json({
        total: preorders.length,
        orders: preorders,
    })
}