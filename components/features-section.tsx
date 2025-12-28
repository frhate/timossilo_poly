export default function FeaturesSection() {
    const features = [
        {
            icon: "✓",
            title: "Produits Authentiques",
            description: "Tous nos produits sont authentiques et certifiés par les marques officielles",
        },
        {
            icon: "🚚",
            title: "Livraison Rapide",
            description: "Livraison sécurisée et rapide dans toute l'Algérie",
        },
        {
            icon: "💳",
            title: "Paiement à la Livraison",
            description: "Payez facilement à la réception de votre commande sans souci",
        },
        {
            icon: "🛡️",
            title: "Garantie Complète",
            description: "Garantie complète sur tous les produits et garantie de satisfaction",
        },
    ]

    return (
        <section className="w-full bg-secondary/50 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4">
                {/* Section header */}
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Pourquoi Choisir Timossilo ?</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Nous nous engageons à offrir les meilleurs services et produits à nos chers clients
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 bg-background rounded-xl border border-border hover:shadow-md transition-all duration-300"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    )
}
