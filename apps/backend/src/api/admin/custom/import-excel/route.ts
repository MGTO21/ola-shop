import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import * as XLSX from "xlsx"

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    try {
        const { fileData } = req.body as { fileData: string } // Base64 encoded Excel

        if (!fileData) {
            return res.status(400).json({ message: "No file data provided." })
        }

        const buffer = Buffer.from(fileData, 'base64')
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet)

        const results = {
            total: jsonData.length,
            success: 0,
            errors: [] as { row: number, message: string }[]
        }

        jsonData.forEach((row, index) => {
            // Logic for Smart Mapping (EN & AR support)
            const productName = row["Product Name"] || row["Name"] || row["Product"] || row["الاسم"] || row["اسم المنتج"]
            const price = row["Price"] || row["Amount"] || row["السعر"] || row["القيمة"]
            const city = row["City"] || row["Location"] || row["المدينة"] || row["الموقع"]

            if (!productName || !price) {
                results.errors.push({
                    row: index + 2, // 1-indexed + header
                    message: `Missing critical data (Name or Price) in row ${index + 2}`
                })
            } else {
                // Here we would trigger a Medusa Workflow to create/update the product
                results.success++
            }
        })

        return res.json({
            message: results.errors.length > 0
                ? "Import completed with some errors."
                : "All rows processed successfully!",
            summary: results
        })

    } catch (error: any) {
        return res.status(500).json({
            message: "فشل تحليل ملف Excel. تأكد من أن الملف غير تالف.",
            error: error.message
        })
    }
}
