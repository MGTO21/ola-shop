import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
    Container,
    Heading,
    Table,
    Button,
    Input,
    Text,
    StatusBadge,
    IconButton
} from "@medusajs/ui"
import { useState } from "react"
import { useAdminRegion, useAdminUpdateRegion } from "medusa-react"
import { Trash, Plus } from "@medusajs/icons"

const ShippingCitiesWidget = ({ data }: { data: any }) => {
    const { region, isLoading } = useAdminRegion(data.id)
    const { mutate: updateRegion, isLoading: isUpdating } = useAdminUpdateRegion(data.id)
    const [newCity, setNewCity] = useState("")

    const cities = (region?.metadata?.shipping_cities as string[]) || []

    const handleAddCity = () => {
        if (!newCity.trim()) return
        const updatedCities = Array.from(new Set([...cities, newCity.trim()]))
        updateRegion({
            metadata: {
                ...region?.metadata,
                shipping_cities: updatedCities
            }
        }, {
            onSuccess: () => setNewCity("")
        })
    }

    const handleRemoveCity = (cityToRemove: string) => {
        const updatedCities = cities.filter(c => c !== cityToRemove)
        updateRegion({
            metadata: {
                ...region?.metadata,
                shipping_cities: updatedCities
            }
        })
    }

    if (isLoading) return <Text>Loading...</Text>

    return (
        <Container className="p-0 overflow-hidden border-rose-100 mt-6">
            <div className="flex items-center justify-between px-6 py-4 bg-rose-50/30">
                <div className="flex items-center gap-3">
                    <Heading level="h2" className="text-rose-900 font-black italic">مدن الشحن المتاحة</Heading>
                    <StatusBadge color="green" className="font-bold">نشط</StatusBadge>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="إضافة مدينة جديدة... (مثلاً: بورتسودان)"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="flex-1"
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
                                    <Table.Cell className="font-bold text-gray-700">{city}</Table.Cell>
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
