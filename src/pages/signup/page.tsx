import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import Button from "../../components/Button";
import { motion } from "framer-motion";
import { validsEmail } from "../../mocks/validsEmail";
import { repository } from "../../repository/repository";
export default function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  async function handleSubmit(email: string, password: string) {
    const isValidEmail = validsEmail
      .map((e) => email.endsWith(e))
      .some((e) => e);
    if (!isValidEmail) {
      toast.error("Email inválido");
      return;
    }
    if (!email || !password) {
      toast.error("Informe todos os campos");
      return;
    }
    setIsSubmiting(true);
    try {
      await repository.auth.signup({ email, password });
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response?.data?.message, { toastId: "errorMessage" });
        return;
      } else {
        toast.error("Erro interno no servidor", { toastId: "serverError" });
      }
    } finally {
      setIsSubmiting(false);
    }
  }
  return (
    <>
      <motion.form
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.75 }}
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSubmit(email, password);
        }}
        className="py-10 px-5 flex flex-col gap-2 max-w-[500px] w-full border border-primary/20 rounded-2xl"
      >
        <h1 className="text-5xl font-bold font-title text-primary">
          Cadastrar
        </h1>
        <p className="text-sm text-text-light font-manrope">
          Preencha os campos e entre já
        </p>
        <div className="flex flex-col">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="Seu endereço de email"
            required
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="email">Senha</Label>
          <Input
            type={visible ? "text" : "password"}
            placeholder="Sua senha"
            required
            id="email"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div id="show-password">
          <label className="font-light">
            <input
              type="checkbox"
              className="p-1"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
            />
            <span> </span>
            Mostrar Senha
          </label>
        </div>
        <Button variant="primary" disabled={isSubmiting}>
          {isSubmiting ? "Cadastrando..." : "Cadastro"}
        </Button>
        <Link
          to={"/signin"}
          className="text-center text-sm text-gray-600 hover:underline"
        >
          Já possui uma conta? Entre
        </Link>
      </motion.form>
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
