import type { PropsWithChildren } from "react";
import type { ModalProps } from "../assets/types";
import { motion } from "framer-motion";
function Root({ children, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-xl"
      >
        {children}
      </motion.div>
    </div>
  );
}

function Header({ children }: PropsWithChildren) {
  return (
    <header className="border-b border-border px-6 py-4">{children}</header>
  );
}

function Title({ children }: PropsWithChildren) {
  return <h2 className="font-title text-3xl text-text">{children}</h2>;
}
function Description({ children }: PropsWithChildren) {
  return <p className="font-ui text-gray-600 text-sm">{children}</p>;
}
function Body({ children }: PropsWithChildren) {
  return <section className="space-y-5 p-6">{children}</section>;
}

function Footer({ children }: PropsWithChildren) {
  return (
    <footer className="flex justify-end gap-3 border-t border-border px-6 py-4">
      {children}
    </footer>
  );
}

function Field({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export const Modal = Object.assign(Root, {
  Header,
  Title,
  Description,
  Body,
  Footer,
  Field,
});
