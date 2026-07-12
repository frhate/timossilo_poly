import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Percent } from "lucide-react";

export default function PromotionSection() {
  return (
    <section className="w-full px-4 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="group relative overflow-hidden rounded-3xl border border-border shadow-xl">
          {/* Background image */}
          <div className="absolute inset-0">

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
          </div>

          {/* Content */}
          <div className="relative flex flex-col items-start gap-5 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:p-16">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <Percent className="h-3.5 w-3.5" />
                Offre limitée
              </div>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Profitez de nos{" "}
                <span className="text-primary">promotions</span> exclusives
              </h2>
              <p className="mt-3 max-w-md text-sm text-white/80 sm:text-base">
                Découvrez nos meilleurs deals sur les smartphones et accessoires.
                Stock limité, ne les ratez pas !
              </p>
            </div>

            <Link
              href="/products"
              className="group/btn inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              Voir les offres
              <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}