import { toast } from "react-toastify";
import type { Step } from "../../assets/types";
import api from "../../services/api.service";
const token = localStorage.getItem("access_token");

async function create(data: Partial<Step>) {
  const dataStep = new FormData();
  dataStep.append("content", data.content!);
  dataStep.append("observations", data.observations!);
  dataStep.append("recipeId", data.recipeId!);
  console.log(data);
  const res = await api.post("/steps", Object.fromEntries(dataStep), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
async function findManyByRecipeId(recipeId: string) {
  const res = await api.get(`/steps/${recipeId}`);
  return res.data;
}
async function deleteStep(recipeId: string, stepId: string) {
  const res = await api.delete(
    `/steps/delete?recipeId=${recipeId}&stepId=${stepId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  toast.success(res.data.message);
}
export const steps = {
  create,
  findManyByRecipeId,
  deleteStep,
};
