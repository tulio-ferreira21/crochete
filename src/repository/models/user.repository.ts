import api from "../../services/api.service";
import type { AxiosResponse } from "axios";
import type { User } from "../../assets/types";
async function get(token: string) {
  const res: AxiosResponse<User> = await api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export const user = {
  get,
};
