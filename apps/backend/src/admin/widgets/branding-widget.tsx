import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { BrandLogo } from "../components/BrandLogo"

const BrandingWidget = () => {
    return (
        <Container className="p-0 overflow-hidden border-none shadow-none bg-transparent mb-4">
            <div className="flex items-center justify-between py-4">
                <BrandLogo />
                <div className="text-right">
                    <Heading level="h1" className="text-2xl font-black text-ui-fg-base">
                        مرحباً بك في لوحة تحكم علا
                    </Heading>
                    <Text className="text-ui-fg-subtle font-medium">
                        إدارة متجرك أصبحت أسهل وأجمل
                    </Text>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --rose-600: #e11d48;
                }
                [data-radix-popper-content-wrapper] {
                    direction: rtl !important;
                }
                /* Soft Arabic Font for Header */
                h1, h2, h3, button, span, p {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                }
            `}} />
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: [
        "dashboard.before",
        "product.list.before",
        "order.list.before",
    ],
})

export default BrandingWidget
