import { toast } from "react-toastify";
import type { Step } from "../../assets/types";
import api from "../../services/api.service";
async function create(data: Partial<Step>) {
  const token = localStorage.getItem("access_token");
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
  const token = localStorage.getItem("access_token");
  const res = await api.get(`/steps/${recipeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
async function deleteStep(recipeId: string, stepId: string) {
  const token = localStorage.getItem("access_token");
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
async function edit(data: Partial<Step>, stepId: string) {
  const token = localStorage.getItem("access_token");
  const res = await api.patch(`/steps/update/${stepId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
export const steps = {
  create,
  findManyByRecipeId,
  deleteStep,
  edit,
};
