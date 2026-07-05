import type { InputProps, TextAreaProps } from "../assets/types";

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="border border-primary/40 rounded-2xl transition duration-100 p-3 w-full font-body outline-0 hover:shadow focus:outline focus:outline-primary"
    />
  );
}

export function TextArea(props: TextAreaProps) {
  return (
    <textarea
      {...props}
      className="border border-primary/40 rounded-2xl transition duration-100 p-3 w-full font-body outline-0 hover:shadow focus:outline focus:outline-primary"
    ></textarea>
  );
}
