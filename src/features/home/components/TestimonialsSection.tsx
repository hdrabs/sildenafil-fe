const testimonials = [
  {
    text: "I had a few doubts that it would help me—but the only other alternative was to purchase the brand name expensive VIAGRA—and if I could get the expected results with this Sildenafil, then I would benefit two-fold.",
    location: "Sildenafil Patient, CA",
  },
  {
    text: "I've issues with ED due to blood flow issues. I had a previous Sildenafil prescription at $50.00 a dose. After paying too high of prices, I was doing some research to find a cheaper price.",
    location: "Sildenafil Patient, NY",
  },
  {
    text: "Very easy to order. The price is unbeatable. My package arrived quickly and discreetly. I will definitely be ordering again.",
    location: "Sildenafil Patient, TX",
  },
];

export const TestimonialsSection = () => (
  <section className="bg-bg-card py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <h2 className="text-center text-3xl font-extrabold text-text-primary">
        Happy Patients
      </h2>
      <p className="mt-2 text-center text-sm text-text-muted">
        Real patients, real results
      </p>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="rounded-xl border border-border-default bg-bg-main p-6"
          >
            <div className="flex text-yellow-400 text-sm">★★★★★</div>
            <p className="mt-3 text-sm text-text-muted">&ldquo;{t.text}&rdquo;</p>
            <p className="mt-4 text-xs font-semibold text-text-primary">
              — {t.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
