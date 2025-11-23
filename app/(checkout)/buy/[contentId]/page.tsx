import { use } from 'react'

export default function BuyContentPage({
    params
}: {
    params: Promise<{ contentId: string }>
}) {
    const { contentId } = use(params)

    return (
        <div>
            <h1>Purchase Content</h1>
            <p>Content ID: {contentId}</p>
        </div>
    )
}
