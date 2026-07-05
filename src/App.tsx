import { ToastContainer } from "react-toastify";
import AppRouter from "./assets/routes";

export default function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer autoClose={2000} />
    </>
  );
}
