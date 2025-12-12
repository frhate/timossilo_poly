import {createClient} from "@/lib/supabase/server"
import Navigation from "@/components/navigation"
import ProductDetails from "@/components/product-details"
import {notFound} from "next/navigation"

export default async function ProductDetailPage({
                                                    params,
                                                }: {
    params: Promise<{ id: string }>
}) {
    const supabase = await createClient()
    const {id} = await params

    const {data: product} = await supabase
        .from("products")
        .select("*, categories(name, id)")
        .eq("id", id)
        .single()

    if (!product) {
        notFound()
    }

    return (
        <div>
            <Navigation/>
            <ProductDetails product={product}/>
        </div>
    )
}