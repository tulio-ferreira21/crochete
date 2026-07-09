// import { useEffect, useState } from "react";
export default function Loading() {
  // const [dots, setDots] = useState("");

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setDots((prev) => {
  //       if (prev === "...") return "";
  //       return prev + ".";
  //     });
  //   }, 300);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="flex  gap-3 justify-center items-center">
      <h2 className="text-2xl font-title tracking-[0.20em]">
        Carregando
        {/* {dots} */}
      </h2>
      <div className="animate-spin w-7 h-7 border-b-2 border-secondary rounded-full"></div>
    </div>
  );
}
