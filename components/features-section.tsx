import {ShieldCheck, Truck, CreditCard, Award, Smartphone} from "lucide-react"

export default function FeaturesSection() {
    const features = [
        {
            icon: ShieldCheck,
            title: "Produits Authentiques",
            description: "Tous nos produits sont authentiques et certifiés par les marques officielles",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            icon: Truck,
            title: "Livraison Rapide",
            description: "Livraison sécurisée et rapide dans toute l'Algérie",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            icon: CreditCard,
            title: "Paiement à la Livraison",
            description: "Payez facilement à la réception de votre commande sans souci",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            icon: Award,
            title: "Garantie Complète",
            description: "Garantie complète sur tous les produits et garantie de satisfaction",
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
    ]

    return (
        <section className="relative w-full bg-gradient-to-b from-slate-50 to-white py-16 md:py-24 lg:py-32">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="mb-12 md:mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-transparent border border-primary/20 rounded-full mb-4 md:mb-6 hover:bg-primary/15 transition-colors">
                        <Smartphone className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                        <span className="text-xs md:text-sm font-semibold text-primary">Pourquoi Choisir Timossilo ?</span>
                    </div>
                    <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Nous nous engageons à offrir les meilleurs services et produits à nos chers clients
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className="group relative p-6 md:p-8 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 ease-out"
                            >
                                {/* Icon container */}
                                <div className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 ${feature.bgColor} rounded-xl mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-7 h-7 md:w-8 md:h-8 ${feature.color}`} strokeWidth={2} />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2 md:mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
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