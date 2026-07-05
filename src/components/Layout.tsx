import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
export default function Layout() {
  const navigate = useNavigate();
  function verifyIsAuth() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/signin");
      return;
    } else {
      return;
    }
  }

  useEffect(() => {
    verifyIsAuth();
  }, []);

  return (
    <main className="flex flex-col h-dvh">
      <header className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link to={"/home"}>
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
      <section className="flex-1">
        <Outlet />
      </section>
      <footer className="border-t ital border-border bg-background py-5 text-center font-ui text-text-light">
        © {new Date().getFullYear()} &copy; Túlio Diego. All rights reserveds
      </footer>
    </main>
  );
}
