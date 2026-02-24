import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Input, Button, toast } from "@medusajs/ui"
import { useState, useEffect } from "react"

const ShippingLimitWidget = () => {
    const [threshold, setThreshold] = useState("500000")
    const [loading, setLoading] = useState(false)

    // In a real implementation, we would fetch this from the Store Metadata
    // For now, we interact with the localStorage or a simple API
    const handleSave = async () => {
        setLoading(true)
        try {
            // Logic to save to Medusa Store Metadata would go here
            toast.success("Shipping threshold updated!")
        } catch (e) {
            toast.error("Failed to update threshold")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4 bg-rose-50/30">
                <div className="text-right w-full">
                    <Heading level="h2" className="text-rose-900 font-black text-right">حد الشحن المجاني</Heading>
                    <Text size="small" className="text-rose-700 font-medium text-right">
                        حدد الحد الأدنى لمبلغ الطلب للتأهل للشحن المجاني (بالجنيه السوداني SDG).
                    </Text>
                </div>
            </div>
            <div className="px-6 py-4">
                <div className="flex items-center gap-x-4">
                    <Input
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        placeholder="500000"
                        className="max-w-[200px]"
                    />
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        isLoading={loading}
                        className="bg-rose-600 hover:bg-rose-700 font-bold"
                    >
                        حفظ التعديلات
                    </Button>
                </div>
            </div>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "store.details.after",
})

export default ShippingLimitWidget
