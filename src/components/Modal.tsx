import type { PropsWithChildren } from "react";
import type { ModalProps } from "../assets/types";
import { motion, AnimatePresence } from "framer-motion";

function Root({ children, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2419]/45 backdrop-blur-sm p-5"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{
            opacity: 0,
            scale: 0.9,
            y: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            y: 30,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="
            relative
            w-full
            max-w-xl
            overflow-hidden
            rounded-[30px]
            border
            border-[#E7DED0]
            bg-[#FFFDF8]
            shadow-[0_25px_60px_rgba(0,0,0,.18)]
          "
        >
          <div className="h-1 bg-gradient-to-r from-secondary via-accent to-rose" />
          <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-[#F0DFC0]/40 blur-3xl pointer-events-none" />

          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Header({ children }: PropsWithChildren) {
  return (
    <header className="relative px-8 py-6 border-b border-[#ECE4D8]">
      {children}
    </header>
  );
}

function Title({ children }: PropsWithChildren) {
  return (
    <h2 className="font-title text-4xl text-primary tracking-wide">
      {children}
    </h2>
  );
}

function Description({ children }: PropsWithChildren) {
  return (
    <p className="mt-2 font-body text-text-light leading-relaxed">{children}</p>
  );
}

function Body({ children }: PropsWithChildren) {
  return <section className="space-y-6 px-8 py-7">{children}</section>;
}

function Footer({ children }: PropsWithChildren) {
  return (
    <>
      <div className="mx-8 h-px bg-gradient-to-r from-transparent via-[#D9C87A] to-transparent" />

      <footer className="flex justify-end gap-4 px-8 py-6">{children}</footer>
    </>
  );
}

function Field({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-3">{children}</div>;
}

export const Modal = Object.assign(Root, {
  Header,
  Title,
  Description,
  Body,
  Footer,
  Field,
});
