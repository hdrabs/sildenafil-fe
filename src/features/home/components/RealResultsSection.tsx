import { RiUserHeartLine } from "react-icons/ri";

export const RealResultsSection = () => (
  <section className="bg-bg-card py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex flex-col items-center gap-8 md:flex-row md:gap-16">
        <div className="flex-1">
          <p className="text-6xl font-extrabold text-primary">74%</p>
          <p className="mt-3 text-xl font-bold text-text-primary">
            Real Patients. Real Results.
          </p>
          <p className="mt-3 text-sm text-text-muted">
            In clinical trials, 74% of men reported improved erections with
            Sildenafil compared to 16% with placebo. Join thousands of men who
            have taken control of their sexual health.
          </p>
          {/* User icons row */}
          <div className="mt-5 flex flex-wrap gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  i < 15 ? "bg-primary text-white" : "bg-primary/20 text-primary"
                }`}
              >
                <RiUserHeartLine className="h-4 w-4" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="rounded-2xl bg-bg-main p-6">
            <blockquote className="text-sm italic text-text-muted">
              &ldquo;I had a few doubts that it would help me—but the only other
              alternative was to purchase the brand name expensive VIAGRA—and if
              I could get the expected results with this Sildenafil, then I would
              benefit two-fold: in the bedroom—and my out of pocket
              expense!&rdquo;
            </blockquote>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex text-yellow-400 text-xs">★★★★★</div>
              <span className="text-xs font-medium text-text-muted">
                Sildenafil Patient, CA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
