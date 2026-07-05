import { Route, Routes } from "react-router-dom";
import Main from "../pages/page";
import SignLayout from "../components/SignLayout";
import Signup from "../pages/signup/page";
import Signin from "../pages/signin/page";
import Layout from "../components/Layout";
import Home from "../pages/authenticated/home/page";
import Recipe from "../pages/authenticated/recipe/page";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<SignLayout />}>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Route>
      <Route element={<Layout />}>
        <Route element={<Home />} path="/home" />
        <Route element={<Recipe />} path="/recipe/:id" />
      </Route>
    </Routes>
  );
}
