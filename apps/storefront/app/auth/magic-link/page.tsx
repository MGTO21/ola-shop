"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

function MagicLinkContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")
    const [status, setStatus] = useState<"loading" | "error" | "success">("loading")
    const [message, setMessage] = useState("Verifying your link...")

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("Invalid login link.")
            return
        }

        const verifyAndLogin = async () => {
            try {
                // Decode token: phone:password:timestamp
                const decoded = atob(token)
                const parts = decoded.split(':')

                if (parts.length < 3) throw new Error("Invalid token format")

                const phone = parts[0]
                const password = parts[1]
                const timestamp = parseInt(parts[2])

                // Check expiry (24h = 86400000ms)
                if (Date.now() - timestamp > 86400000) {
                    throw new Error("Link has expired.")
                }

                setStatus("loading")
                setMessage(`Logging in as ${phone}...`)

                // Attempt Login
                // Use env var or fallback to relative path if proxy, or hardcoded VPS IP for now
                const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://46.224.43.113:9000"

                const res = await fetch(`${backendUrl}/store/auth`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: `${phone.replace('+', '')}@whatsapp.user`,
                        password: password
                    })
                })

                if (res.ok) {
                    setStatus("success")
                    setMessage("Login successful! Redirecting...")
                    // Set session cookie if needed (Medusa does this automatically with credentials: include, wait fetch needs credentials: include)
                    // The standard fetch doesn't send cookies by default.

                    // RETRY with credentials
                    /*
                    const resWithCookie = await fetch(`${backendUrl}/store/auth`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ... }),
                        credentials: 'include' // Important for session cookie!
                    })
                    */

                    setTimeout(() => {
                        window.location.href = "/account" // Full reload to ensure state updates
                    }, 1000)
                } else {
                    const errData = await res.json()
                    console.error("Login Error:", errData)
                    throw new Error(errData.message || "Login failed")
                }

            } catch (err: any) {
                console.error(err)
                setStatus("error")
                setMessage(err.message || "Failed to process magic link")
            }
        }

        // We need to re-fetch with credentials: include logic inside
        // Let's refine the fetch above.
        const doLogin = async () => {
            try {
                const decoded = atob(token)
                const parts = decoded.split(':')
                if (parts.length < 3) throw new Error("Invalid token")
                const [phone, password, ts] = parts

                const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://46.224.43.113:9000"

                const res = await fetch(`${backendUrl}/store/auth`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: `${phone.replace('+', '')}@whatsapp.user`,
                        password: password
                    }),
                    credentials: 'include'
                })

                if (res.ok) {
                    setStatus("success")
                    setMessage("Login successful! Redirecting...")
                    setTimeout(() => window.location.href = "/account", 1000)
                } else {
                    throw new Error("Invalid credentials or server error")
                }
            } catch (e: any) {
                setStatus("error")
                setMessage(e.message)
            }
        }

        doLogin()

    }, [token, router])

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
            {status === "loading" && (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
                    <h2 className="text-xl font-bold text-gray-800">{message}</h2>
                </div>
            )}
            {status === "success" && (
                <div className="flex flex-col items-center gap-4">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                    <h2 className="text-xl font-bold text-gray-800">Success!</h2>
                    <p className="text-gray-600">{message}</p>
                </div>
            )}
            {status === "error" && (
                <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <h2 className="text-xl font-bold text-gray-800">Login Failed</h2>
                    <p className="text-gray-600 mb-4">{message}</p>
                    <a href="/login" className="text-blue-600 hover:underline">Go to Login</a>
                </div>
            )}
        </div>
    )
}

export default function MagicLinkPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <Suspense fallback={<div className="p-8">Loading...</div>}>
                    <MagicLinkContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
