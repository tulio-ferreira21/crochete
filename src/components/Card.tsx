import type { PropsWithChildren } from "react";

function Root({ children }: PropsWithChildren) {
  return (
    <article
      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      border
      border-[#E6DED1]
      bg-[#FFFDF8]
      shadow-sm
      transition-all
      duration-500
      hover:-translate-y-2
      hover:shadow-2xl
      hover:border-[#D8C7A3]
      h-full
      "
    >
      {children}
    </article>
  );
}

function Image({ urlImage }: { urlImage: string }) {
  return (
    <div className="overflow-hidden">
      <img
        src={urlImage}
        alt=""
        className="
        aspect-video
        w-full
        h-full
        object-cover
        transition-transform
        duration-700
        group-hover:scale-110
        "
      />
    </div>
  );
}

function Content({ children }: PropsWithChildren) {
  return <section className="space-y-4 p-7">{children}</section>;
}

function Title({ children }: PropsWithChildren) {
  return (
    <h2
      className="
      font-title
      text-4xl
      text-primary
      leading-none
      "
    >
      {children}
    </h2>
  );
}

function Subtitle({ children }: PropsWithChildren) {
  return (
    <p
      className="
      font-body
      text-text-light
      leading-7
      text-[15px]
      "
    >
      {children}
    </p>
  );
}

function Footer({ children }: PropsWithChildren) {
  return (
    <>
      <div className="mx-7 h-px bg-gradient-to-r from-transparent via-[#DCCB86] to-transparent" />

      <footer
        className="
        flex
        justify-end
        items-center
        gap-3
        p-5
        "
      >
        {children}
      </footer>
    </>
  );
}

export const Card = Object.assign(Root, {
  Image,
  Content,
  Title,
  Subtitle,
  Footer,
});
