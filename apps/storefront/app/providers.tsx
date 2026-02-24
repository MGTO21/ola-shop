"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { Toaster } from "sonner"
import { LanguageProvider } from "@/lib/context/LanguageContext"

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        refetchOnWindowFocus: false,
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <LanguageProvider>
                <Toaster position="top-center" expand={false} richColors dir="rtl" />
                {children}
            </LanguageProvider>
        </QueryClientProvider>
    )
}
