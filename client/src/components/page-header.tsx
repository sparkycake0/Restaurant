export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <section className="border-b border-line bg-raised">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl text-cream sm:text-5xl lg:text-[54px]">{title}</h1>
        {sub && <p className="mt-3 max-w-2xl text-base text-muted sm:text-lg">{sub}</p>}
      </div>
    </section>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1200px] px-4 sm:px-6 ${className}`}>{children}</div>;
}
