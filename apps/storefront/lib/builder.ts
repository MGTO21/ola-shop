import { builder } from "@builder.io/sdk"

// Replace with your actual Builder.io Public API Key
const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || "YOUR_BUILDER_PUBLIC_API_KEY"

builder.init(BUILDER_API_KEY)

export const isBuilderPreview = typeof window !== "undefined" && window.location.search.includes("builder.preview=true")
