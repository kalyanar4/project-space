const testimonials = [
  {
    quote:
      "We cut proposal packaging time from 40 minutes to under 10 with the PDF merge and AI drafting flow.",
    author: "Freelance Brand Strategist",
  },
  {
    quote:
      "PDF to Word alone saved our agency from repetitive retyping work every single day.",
    author: "Operations Lead, 6-person Agency",
  },
  {
    quote:
      "The tools are straightforward, fast, and good enough to run inside real client delivery workflows.",
    author: "Independent Product Consultant",
  },
];

interface TestimonialsGridProps {
  title?: string;
}

export default function TestimonialsGrid({ title = "Early User Quotes" }: TestimonialsGridProps) {
  return (
    <section className="reveal-fade-up">
      <div className="page-intro mb-6">
        <h2 className="page-title">{title}</h2>
        <p className="page-subtitle">Signals from early freelancers and small agency users.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-grid">
        {testimonials.map((item) => (
          <article key={item.author} className="service-card reveal-fade-up">
            <p className="mb-4">&ldquo;{item.quote}&rdquo;</p>
            <p className="text-sm text-muted">{item.author}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
