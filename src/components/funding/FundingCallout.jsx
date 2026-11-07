export default function FundingCallout() {
  return (
    <a
      href="#/plan"
      className="group block mb-8 p-4 sm:p-5 border border-line rounded-2xl bg-gold/15 hover:bg-gold/25 transition-colors rise"
      style={{ '--i': 1 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="kicker mb-1">Don&rsquo;t earn a lot? You may still qualify</p>
          <p className="display text-xl font-semibold leading-snug">
            Firefighter, nurse, teacher, public worker, or just stretched thin? Answer 12 questions and see which home loan plans fit you.
          </p>
        </div>
        <span className="num text-sm font-medium underline underline-offset-4 group-hover:no-underline">
          Find my plan →
        </span>
      </div>
    </a>
  );
}
