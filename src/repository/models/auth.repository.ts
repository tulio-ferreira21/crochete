import type { AxiosResponse } from "axios";
import type { AuthData } from "../../assets/types";
import api from "../../services/api.service";
import { toast } from "react-toastify";

async function signup(data: AuthData) {
  const res: AxiosResponse<{ access_token: string }> = await api.post(
    "/auth/signup",
    data,
  );
  if (!res.data.access_token)
    return toast.error("Erro ao conseguir credenciais");
  return localStorage.setItem("access_token", res.data.access_token);
}
async function signin(data: AuthData) {
  const res: AxiosResponse<{ access_token: string }> = await api.post(
    "/auth/signin",
    data,
  );
  if (!res.data.access_token)
    return toast.error("Erro ao conseguir credenciais", {
      toastId: "errorCredentials",
    });
  return localStorage.setItem("access_token", res.data.access_token);
}
export const auth = {
  signup,
  signin,
};
