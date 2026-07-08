import { toast } from "react-toastify";
import api from "../../services/api.service";
import type { AxiosResponse } from "axios";
import type { Recipes } from "../../assets/types";
interface createRecipe {
  title: string;
  description: string;
  files: File[];
}
async function create({ description, title, files }: createRecipe) {
  const token = localStorage.getItem("access_token");
  const dataRecipe = new FormData();
  dataRecipe.append("title", title);
  dataRecipe.append("description", description);
  for (const file of files) {
    dataRecipe.append("images", file);
  }
  const res = await api.post("/recipes", dataRecipe, {
    headers: { Authorization: `Bearer ${token}` },
  });
  toast.success("Projeto criado com sucesso", {
    toastId: "recipe-create",
  });
  return res.data;
}
async function findMany() {
  const token = localStorage.getItem("access_token");
  const res: AxiosResponse<Recipes[]> = await api.get<Recipes[]>("/recipes", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

async function findOne(id: string) {
  const token = localStorage.getItem("access_token");
  const res: AxiosResponse<Recipes> = await api.get<Recipes>(`/recipes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export const recipe = {
  create,
  findOne,
  findMany,
};
