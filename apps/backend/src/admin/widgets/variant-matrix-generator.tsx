import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, Input, Label, Text } from "@medusajs/ui"
import { useState } from "react"
import { Plus, Wand2 } from "lucide-react"

const VariantMatrixGeneratorWidget = () => {
    const [options, setOptions] = useState([
        { title: "Color", values: "Red, Black, Beige" },
        { title: "Size", values: "S, M, L, XL" }
    ])

    const generatePreview = () => {
        const combinations: string[] = []
        const opt1 = options[0].values.split(",").map(v => v.trim())
        const opt2 = options[1].values.split(",").map(v => v.trim())

        opt1.forEach(o1 => {
            opt2.forEach(o2 => {
                combinations.push(`${o1} / ${o2}`)
            })
        })
        return combinations
    }

    const preview = generatePreview()

    return (
    return (
        <Container className="p-6 border-rose-100 bg-rose-50/5 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Heading level="h2" className="flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-rose-600" /> مولد الخصائص التلقائي (Variant Matrix)
                    </Heading>
                    <Text className="text-ui-fg-subtle">توليد تلقائي للمقاسات والألوان في ثوانٍ</Text>
                </div>
                <Button variant="secondary" className="flex gap-2 border-rose-200 text-rose-700 hover:bg-rose-50 font-bold">
                    <Plus className="w-4 h-4" /> إضافة خيار جديد
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                {options.map((opt, idx) => (
                    <div key={idx} className="space-y-2 bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
                        <Label className="font-black text-rose-900">{opt.title === "Color" ? "اللون" : opt.title === "Size" ? "المقاس" : opt.title}</Label>
                        <Input
                            className="focus:border-rose-300 focus:ring-rose-200"
                            value={opt.values}
                            onChange={(e) => {
                                const newOpts = [...options]
                                newOpts[idx].values = e.target.value
                                setOptions(newOpts)
                            }}
                            placeholder="Red, Blue, Green..."
                        />
                    </div>
                ))}
            </div>

            {preview.length > 0 && (
                <div className="mt-6 border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <Text className="font-black">سوف يتم توليد <span className="text-rose-600">{preview.length}</span> نوع مختلف:</Text>
                        <Button className="bg-rose-600 hover:bg-rose-700 text-white font-black shadow-lg shadow-rose-200">
                            بدء التوليد التلقائي ({preview.length} نوع)
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                        {preview.map((p, i) => (
                            <span key={i} className="bg-white border text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "product.details.before",
})

export default VariantMatrixGeneratorWidget
