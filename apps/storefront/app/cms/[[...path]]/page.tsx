import { builder } from "@builder.io/sdk"
import RenderBuilderContent from "@/components/builder/BuilderComponent"
import "@/lib/builder"

export default async function Page(props: {
    params: Promise<{ path: string[] }>
}) {
    const params = await props.params
    const urlPath = "/" + (params.path?.join("/") || "")

    const content = await builder
        .get("page", {
            userAttributes: {
                urlPath,
            },
        })
        .toPromise()

    return (
        <main className="min-h-screen">
            <RenderBuilderContent model="page" content={content} />
        </main>
    )
}
