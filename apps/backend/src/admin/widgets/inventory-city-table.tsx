import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Table, Badge } from "@medusajs/ui"

const InventoryCityTableWidget = () => {
    // Demo data - in a real scenario, we'd fetch from Medusa's Stock Location / Inventory API
    const inventoryData = [
        { city: "بورتسودان (Port Sudan)", location: "loc_PORT_SUDAN", stock: 15, status: "In Stock" },
        { city: "الخرطوم (Khartoum)", location: "loc_KHARTOUM", stock: 0, status: "Out of Stock" },
        { city: "عطبرة (Atbara)", location: "loc_ATBARA", stock: 5, status: "Low Stock" },
    ]

    return (
        <Container className="divide-y p-0 overflow-hidden border-rose-100">
            <div className="flex items-center justify-between px-6 py-4 bg-rose-50/30">
                <Heading level="h2" className="text-rose-900 font-black">المخزون حسب المدينة</Heading>
            </div>
            <Table>
                <Table.Header>
                    <Table.Row className="bg-gray-50/50">
                        <Table.HeaderCell className="text-right">المدينة</Table.HeaderCell>
                        <Table.HeaderCell className="text-right">معرف الموقع</Table.HeaderCell>
                        <Table.HeaderCell className="text-right">الكمية</Table.HeaderCell>
                        <Table.HeaderCell className="text-right">الحالة</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {inventoryData.map((item) => (
                        <Table.Row key={item.location}>
                            <Table.Cell className="font-bold">{item.city}</Table.Cell>
                            <Table.Cell className="text-ui-fg-subtle">{item.location}</Table.Cell>
                            <Table.Cell>{item.stock}</Table.Cell>
                            <Table.Cell>
                                <Badge color={item.stock > 10 ? "green" : item.stock > 0 ? "orange" : "red"} className="font-bold">
                                    {item.stock > 10 ? "متوفر" : item.stock > 0 ? "كمية منخفضة" : "نفد المخزون"}
                                </Badge>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "product.details.after",
})

export default InventoryCityTableWidget
