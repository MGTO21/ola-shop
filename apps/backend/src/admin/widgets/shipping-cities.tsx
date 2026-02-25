import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminRegion } from "@medusajs/framework/types"
import {
    Container,
    Heading,
    Table,
    Button,
    Input,
    Text,
    StatusBadge,
    IconButton,
    toast
} from "@medusajs/ui"
import { useState, useEffect } from "react"
import { Trash, Plus } from "@medusajs/icons"

const ShippingCitiesWidget = ({ data }: DetailWidgetProps<AdminRegion>) => {
    console.log("[ShippingCitiesWidget] v1.2 Mounted with data.id:", data?.id)
    const [region, setRegion] = useState<any>(data)
    const [isUpdating, setIsUpdating] = useState(false)
    const [newCity, setNewCity] = useState("")

    useEffect(() => {
        if (data) {
            console.log("[ShippingCitiesWidget] Data sync update:", data.id)
            setRegion(data)
        }
    }, [data])

    const cities = (region?.metadata?.shipping_cities as string[]) || []

    const handleAddCity = async () => {
        if (!newCity.trim()) return
        setIsUpdating(true)
        const updatedCities = Array.from(new Set([...cities, newCity.trim()]))

        console.log("[ShippingCitiesWidget] Attempting to ADD city:", newCity.trim())
        try {
            const url = `/admin/regions/${data.id}`
            console.log("[ShippingCitiesWidget] Fetching POST to:", url)

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    metadata: {
                        ...region?.metadata,
                        shipping_cities: updatedCities
                    }
                })
            })

            console.log("[ShippingCitiesWidget] Response Status:", response.status)
            if (!response.ok) {
                const errText = await response.text()
                console.error("[ShippingCitiesWidget] API Error Text:", errText)
                throw new Error(`Failed with status ${response.status}`)
            }

            const result = await response.json()
            setRegion(result.region || region)
            setNewCity("")
            toast.success("تمت إضافة المدينة بنجاح")

            console.log("[ShippingCitiesWidget] Success! Reloading in 1s...")
            setTimeout(() => window.location.reload(), 1000)
        } catch (e: any) {
            console.error("[ShippingCitiesWidget] Exception in handleAddCity:", e)
            toast.error(`خطأ في الإضافة: ${e.message}`)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleRemoveCity = async (cityToRemove: string) => {
        setIsUpdating(true)
        const updatedCities = cities.filter(c => c !== cityToRemove)

        console.log("[ShippingCitiesWidget] Attempting to REMOVE city:", cityToRemove)
        try {
            const response = await fetch(`/admin/regions/${data.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    metadata: {
                        ...region?.metadata,
                        shipping_cities: updatedCities
                    }
                })
            })

            if (!response.ok) throw new Error("Failed to delete")

            const result = await response.json()
            setRegion(result.region || region)
            toast.success("تم حذف المدينة بنجاح")

            setTimeout(() => window.location.reload(), 1000)
        } catch (e: any) {
            console.error("[ShippingCitiesWidget] Exception in handleRemoveCity:", e)
            toast.error(`خطأ في الحذف: ${e.message}`)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <Container className="p-0 overflow-hidden border-rose-100 mt-6 text-right shadow-lg border-2">
            <div className="flex items-center justify-between px-6 py-4 bg-rose-50">
                <div className="flex items-center gap-3">
                    <StatusBadge color="green" className="font-bold">نشط</StatusBadge>
                    <Heading level="h2" className="text-rose-900 font-black italic select-none">🌍 مدن الشحن المتاحة</Heading>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex gap-2 direction-rtl">
                    <Input
                        placeholder="إضافة مدينة جديدة... (مثلاً: الخرطوم)"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="flex-1 text-right font-bold"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCity()}
                    />
                    <Button
                        variant="primary"
                        onClick={handleAddCity}
                        isLoading={isUpdating}
                        className="bg-rose-600 hover:bg-rose-700 font-bold px-8 shadow-md"
                    >
                        <Plus className="mr-2" /> إضافة
                    </Button>
                </div>

                <div className="border rounded-xl overflow-hidden shadow-inner bg-white">
                    <Table>
                        <Table.Header>
                            <Table.Row className="bg-gray-50/80">
                                <Table.HeaderCell className="text-right py-4">اسم المدينة</Table.HeaderCell>
                                <Table.HeaderCell className="text-left w-[120px] py-4">الإجراءات</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {cities.length > 0 ? (
                                cities.map((city, index) => (
                                    <Table.Row key={index} className="hover:bg-rose-50/20 transition-colors">
                                        <Table.Cell className="font-bold text-gray-800 text-right text-lg py-4">{city}</Table.Cell>
                                        <Table.Cell className="text-left py-4">
                                            <IconButton
                                                variant="transparent"
                                                onClick={() => handleRemoveCity(city)}
                                                className="text-rose-600 hover:bg-rose-100 transition-all rounded-full p-2"
                                            >
                                                <Trash />
                                            </IconButton>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan={2} className="text-center py-12 text-gray-400 font-bold italic bg-gray-50/30">
                                        ⚠️ لا توجد مدن مضافة حالياً.
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: [
        "region.details.after",
        "region.details.side.before"
    ],
})

export default ShippingCitiesWidget
