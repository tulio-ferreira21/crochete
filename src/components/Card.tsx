import type { PropsWithChildren } from "react";

function Root({ children }: PropsWithChildren) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-lg">
      {children}
    </article>
  );
}

function Image({ urlImage }: { urlImage: string }) {
  return (
    <div className="overflow-hidden border-b border-border">
      <img
        src={urlImage}
        alt=""
        className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
      />
    </div>
  );
}

function Content({ children }: PropsWithChildren) {
  return (
    <section className="space-y-3 p-6">
      {children}
    </section>
  );
}

function Title({ children }: PropsWithChildren) {
  return (
    <h2 className="font-title text-3xl text-text">
      {children}
    </h2>
  );
}

function Subtitle({ children }: PropsWithChildren) {
  return (
    <p className="font-body leading-relaxed text-text-light">
      {children}
    </p>
  );
}

function Footer({ children }: PropsWithChildren) {
  return (
    <footer className="flex justify-end gap-3 border-t border-border px-6 py-4">
      {children}
    </footer>
  );
}

export const Card = Object.assign(Root, {
  Image,
  Content,
  Title,
  Subtitle,
  Footer,
});