import { Link } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";
import { motion } from "framer-motion";
import Button from "../components/Button";

export default function Main(): JSX.Element {
  return (
    <>
      <div className="max-w-2xl">
        <motion.h2
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-title text-primary text-6xl lg:text-8xl leading-none"
        >
          Anote suas
          <br />
          <span className="italic text-secondary">receitas.</span>
        </motion.h2>

        <motion.p
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 font-body text-text text-xl leading-9"
        >
          Organize receitas de crochê, acompanhe cada carreira, registre ideias
          e mantenha todos os seus projetos em um único lugar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-5 mt-12"
        >
          <Link to="/signup">
            <Button variant="primary">Criar Conta</Button>
          </Link>

          <Link to="/signin">
            <Button variant="outline-primary">Fazer login</Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.8,
          type: "spring",
          stiffness: 100,
        }}
        className="flex justify-center items-center"
      >
        <div className="bg-surface border border-border shadow-sm rounded-full w-[420px] h-[420px] hidden xl:flex items-center justify-center">
          <div className="text-center">
            <svg
              width="700"
              height="220"
              viewBox="0 0 700 220"
              className="w-full"
            >
              <motion.path
                d="
              M20 110
              C120 30 220 190 340 90
              S520 40 600 110
              C620 130 620 150 600 165
            "
                fill="none"
                stroke="#C98F97"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                }}
              />

              <motion.path
                d="
              M600 165
              C590 150 565 150 565 172
              C565 192 590 205 600 214
              C610 205 635 192 635 172
              C635 150 610 150 600 165
            "
                fill="none"
                stroke="#C98F97"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  delay: 2.3,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
              />
            </svg>

            <h2 className="font-logo text-primary text-3xl font-medium mt-4">
              Crochet
              <span className="text-secondary italic">tê</span>
            </h2>

            <p className="font-body text-secondary text-lg italic mt-2">
              Cada receita conta uma história.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
