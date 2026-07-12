import Link from "next/link"
import { ArrowRight, Send, MessageCircle } from "lucide-react"

export default function FinalCta() {
    return (
        <section className="relative w-full overflow-hidden py-16 md:py-24">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
            </div>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 text-center shadow-xl sm:p-12 lg:p-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        Prêt à trouver votre{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            prochain appareil ?
                        </span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                        Rejoignez notre communauté et recevez nos meilleures offres en avant-première
                        directement sur Telegram.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/products"
                            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 sm:w-auto"
                        >
                            Commencer mes achats
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>

                    </div>

                    <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <Send className="h-4 w-4 text-primary" />
                        Livraison rapide · Paiement à la livraison · Garantie 6 mois
                    </p>
                </div>
            </div>
        </section>
    )
}

