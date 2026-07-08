import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
export default function SignLayout() {
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      localStorage.clear()
    }
  }, []);
  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen flex flex-col bg-background"
      >
        <header className="border-b border-border bg-background">
          <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
            <Link to={"/"}>
              <motion.h1
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-logo text-5xl tracking-[0.12em] text-primary"
              >
                Crochettê
              </motion.h1>
            </Link>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 font-ui"
            ></motion.div>
          </div>
        </header>
        <section className="flex-1 max-w-7xl mx-auto w-full px-8 py-20 flex flex-col lg:flex-row items-center justify-between gap-20">
          <Outlet />
        </section>
        <footer className="border-t ital border-border bg-background py-5 text-center font-ui text-text-light">
          © {new Date().getFullYear()} &copy; Túlio Diego. All rights reserveds
        </footer>
      </motion.main>
    </>
  );
}
