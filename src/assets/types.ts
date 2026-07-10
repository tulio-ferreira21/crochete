import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  PropsWithChildren,
  TextareaHTMLAttributes,
} from "react";

export interface authContext {
  user: string | null;
  login: (id: string) => void;
  logout: () => void;
}

export interface AuthResponse {
  access_token: string;
}
export interface AuthData {
  email: string;
  password: string;
}
export interface User {
  id: string;
  name?: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  recipes: Recipes[];
}
export interface Recipes {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  steps: Step[];
  urlImages: string[];
}
export interface Step {
  id: string;
  content: string;
  observations: string;
  order: number;
  recipeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ButtonProps extends PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> {
  variant:
    | "primary"
    | "outline-primary"
    | "secondary"
    | "success"
    | "outline-success"
    | "danger"
    | "outline-danger";
}
export interface LabelProps extends PropsWithChildren<
  LabelHTMLAttributes<HTMLLabelElement>
> {}
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}
export interface ModalProps extends PropsWithChildren {
  onClose: () => void;
}

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}
