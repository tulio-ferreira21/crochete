import { auth } from "./models/auth.repository";
import { recipe } from "./models/recipes.repository";
import { steps } from "./models/steps.repository";
import { user } from "./models/user.repository";

export const repository = {
  auth,
  recipe,
  user,
  steps
};
