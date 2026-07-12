import { ShieldCheck, Truck, CreditCard, Award, Sparkles } from "lucide-react"

export default function FeaturesSection() {
    const features = [
        {
            icon: ShieldCheck,
            title: "Produits authentiques",
            description: "Tous nos produits sont authentiques et certifiés par les marques officielles.",
        },
        {
            icon: Truck,
            title: "Livraison rapide",
            description: "Livraison sécurisée et rapide dans toute l'Algérie, en 24 à 48h.",
        },
        {
            icon: CreditCard,
            title: "Paiement à la livraison",
            description: "Payez facilement à la réception de votre commande, sans souci.",
        },
        {
            icon: Award,
            title: "Garantie complète",
            description: "Garantie complète sur tous les produits et satisfaction garantie.",
        },
    ]

    return (
        <section className="relative w-full bg-background py-16 md:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center md:mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                        <Sparkles className="h-4 w-4" />
                        Pourquoi choisir Timossilo ?
                    </div>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        Une expérience{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            sans compromis
                        </span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                        Nous nous engageons à offrir les meilleurs services et produits à nos chers clients.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={feature.title}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 md:p-8"
                            >
                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground md:h-16 md:w-16">
                                    <Icon className="h-7 w-7 md:h-8 md:w-8" strokeWidth={2} />
                                </div>
                                <h3 className="relative mt-5 text-lg font-semibold text-foreground md:text-xl">
                                    {feature.title}
                                </h3>
                                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}