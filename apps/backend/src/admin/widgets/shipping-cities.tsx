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
    const [region, setRegion] = useState<any>(data)
    const [isUpdating, setIsUpdating] = useState(false)
    const [newCity, setNewCity] = useState("")

    // Sync data if it changes
    useEffect(() => {
        setRegion(data)
    }, [data])

    const cities = (region?.metadata?.shipping_cities as string[]) || []

    const handleAddCity = async () => {
        if (!newCity.trim()) return
        setIsUpdating(true)
        const updatedCities = Array.from(new Set([...cities, newCity.trim()]))

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

            if (!response.ok) throw new Error("Failed to update")

            const result = await response.json()
            // In Medusa v2, the response might be different, let's try to fetch fresh or use data from result
            setRegion(result.region || region)
            setNewCity("")
            toast.success("تمت إضافة المدينة بنجاح")

            // Force reload to see changes if metadata sync is slow
            setTimeout(() => window.location.reload(), 1000)
        } catch (e) {
            toast.error("فشل في إضافة المدينة")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleRemoveCity = async (cityToRemove: string) => {
        setIsUpdating(true)
        const updatedCities = cities.filter(c => c !== cityToRemove)

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

            if (!response.ok) throw new Error("Failed to update")

            const result = await response.json()
            setRegion(result.region || region)
            toast.success("تم حذف المدينة")

            setTimeout(() => window.location.reload(), 1000)
        } catch (e) {
            toast.error("فشل في حذف المدينة")
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <Container className="p-0 overflow-hidden border-rose-100 mt-6 text-right">
            <div className="flex items-center justify-between px-6 py-4 bg-rose-50/30">
                <div className="flex items-center gap-3">
                    <StatusBadge color="green" className="font-bold">نشط</StatusBadge>
                    <Heading level="h2" className="text-rose-900 font-black italic">مدن الشحن المتاحة</Heading>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex gap-2 direction-rtl">
                    <Input
                        placeholder="إضافة مدينة جديدة... (مثلاً: بورتسودان)"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="flex-1 text-right"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCity()}
                    />
                    <Button
                        variant="primary"
                        onClick={handleAddCity}
                        isLoading={isUpdating}
                        className="bg-rose-600 hover:bg-rose-700 font-bold"
                    >
                        <Plus className="mr-2" /> إضافة
                    </Button>
                </div>

                <Table>
                    <Table.Header>
                        <Table.Row className="bg-gray-50/50">
                            <Table.HeaderCell className="text-right">اسم المدينة</Table.HeaderCell>
                            <Table.HeaderCell className="text-left w-[100px]">إجراءات</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {cities.length > 0 ? (
                            cities.map((city, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell className="font-bold text-gray-700 text-right">{city}</Table.Cell>
                                    <Table.Cell className="text-left">
                                        <IconButton
                                            variant="transparent"
                                            onClick={() => handleRemoveCity(city)}
                                            className="text-rose-600 hover:bg-rose-50"
                                        >
                                            <Trash />
                                        </IconButton>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        ) : (
                            <Table.Row>
                                <Table.Cell colSpan={2} className="text-center py-8 text-gray-400 font-medium italic">
                                    لا توجد مدن مضافة حالياً. سيتم استخدام القائمة الافتراضية في الموقع.
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            </div>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "region.details.after",
})

export default ShippingCitiesWidget
