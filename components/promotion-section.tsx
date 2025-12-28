export default function PromotionSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Promotion</h2>

        <picture>
          <source media="(min-width: 768px)" srcSet="/timossilo.jpg" />
          <source media="(max-width: 767px)" srcSet="/timossilo-mobile.jpg" />
          <img
            src="/timossilo.jpg"
            alt="Promotion Timossilo"
            className="w-full h-auto rounded-lg"
          />
        </picture>
      </div>
    </section>
  );
}