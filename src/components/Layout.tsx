import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaInstagram, FaPinterest, FaWhatsapp } from "react-icons/fa";

export default function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#FCFBF7] via-[#F7F3EC] to-[#F3EEE4] text-text">
      <header className="relative overflow-hidden border-b border-[#E5DCCF] shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F9F4EA] via-[#FFFDF8] to-[#F9F4EA]" />

        <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#EFDDBA]/30 blur-3xl" />

        <div className="absolute left-0 top-0 h-full w-52 bg-gradient-to-r from-[#D9E0C4]/20 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-52 bg-gradient-to-l from-[#D9E0C4]/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-10 py-5 flex items-center justify-between">
          <Link to="/home">
            <h1 className="font-ui tracking-[0.20em] font-light text-3xl">
              Crochettê
            </h1>
          </Link>
        </div>

        <div className="h-[4px] bg-gradient-to-r from-secondary via-accent to-rose" />
      </header>

      <section className="flex-1 relative overflow-hidden">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-[#C98F97]/5 blur-3xl" />

        <div className="absolute right-0 bottom-10 h-96 w-96 rounded-full bg-[#8F966A]/5 blur-3xl" />

        <div className="relative max-w-[1000rem] mx-auto px-10 py-10">
          <Outlet />
        </div>
      </section>

      <footer className="relative mt-16 overflow-hidden border-t border-[#6B5737]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4E3B23] via-[#5A4528] to-[#6A5231]" />
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#DCCB86]/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-10 py-14">
          <div className="flex justify-between gap-10 md:grid-cols-4">
            <div className="w-xl">
              <h2 className="font-logo text-4xl tracking-[.25em] text-white">
                CROCHETTÊ
              </h2>
              <p className="mt-5 text-[#E8DFD2] leading-7">
                Um espaço dedicado para guardar suas receitas, inspirações e
                momentos especiais na cozinha.
              </p>
            </div>
            <div>
              <h3 className="mb-5 font-ui font-semibold uppercase tracking-widest text-[#DCCB86]">
                Redes Sociais
              </h3>

              <div className="space-y-4">
                <a
                  href="#"
                  className="flex items-center gap-3 text-[#E8DFD2] transition hover:text-white"
                >
                  <FaInstagram size={18} />
                  Instagram
                </a>

                <a
                  href="#"
                  className="flex items-center gap-3 text-[#E8DFD2] transition hover:text-white"
                >
                  <FaPinterest size={18} />
                  Pinterest
                </a>

                <a
                  href="#"
                  className="flex items-center gap-3 text-[#E8DFD2] transition hover:text-white"
                >
                  <FaWhatsapp size={18} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
          <div className="my-10 h-px bg-gradient-to-r from-transparent via-[#DCCB86] to-transparent" />
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-[#D8CDBB]">
              © {new Date().getFullYear()} Crochettê. Todos os direitos
              reservados.
            </p>
            <div className="flex items-center gap-2 text-[#D8CDBB] text-sm">
              Desenvolvido por <b>Túlio Diego</b>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
