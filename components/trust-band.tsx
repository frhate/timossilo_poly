import { Package, Users, Star, ThumbsUp } from "lucide-react"

const stats = [
    { icon: Package, value: "1000+", label: "Produits en stock" },
    { icon: Users, value: "5000+", label: "Clients satisfaits" },
    { icon: Star, value: "4.9/5", label: "Note moyenne" },
    { icon: ThumbsUp, value: "98%", label: "Clients fidèles" },
]

export default function TrustBand() {
    return (
        <section className="border-y border-border bg-secondary/30">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
                {stats.map(({ icon: Icon, value, label }) => (
                    <div key={label} className="flex items-center justify-center gap-3 text-center md:justify-start">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                        </span>
                        <div className="text-left">
                            <p className="text-xl font-extrabold text-foreground md:text-2xl">{value}</p>
                            <p className="text-xs text-muted-foreground md:text-sm">{label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

