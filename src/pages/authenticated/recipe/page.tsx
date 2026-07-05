import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { repository } from "../../../repository/repository";
import { toast } from "react-toastify";
import type { Recipes, Step } from "../../../assets/types";
import Button from "../../../components/Button";
import { BiPencil, BiPlus, BiSolidTrash, BiTrash } from "react-icons/bi";
import { Modal } from "../../../components/Modal";
import { Label } from "../../../components/Label";
import { TextArea } from "../../../components/Input";

export default function Recipe() {
  const [recipe, setRecipe] = useState<Recipes | null>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [step, setStep] = useState<Step>();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [observations, setObservations] = useState<string>("");
  const [nameStep, setNameStep] = useState<string>("");
  const [stepId, setStepId] = useState<string>("");
  const { id } = useParams();
  const navigate = useNavigate();
  async function handleSubmitStep() {
    if (!content) {
      toast.error("Informe o conteúdo do passo", { toastId: "cotentError" });
      return;
    }
    setIsSubmiting(true);
    try {
      await repository.steps.create({ content, observations, recipeId: id });
      toast.success("Passo criado com sucesso");
      setContent("");
      setObservations("");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        if (errorMessage === "Sessão inválida") {
          navigate("/signin");
          return;
        }
        toast.error(
          Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
          { toastId: "errorMessage" },
        );
        return;
      } else {
        toast.error("Erro interno no servidor", { toastId: "serverError" });
      }
    } finally {
      setIsSubmiting(false);
    }
  }
  async function handleDeleteStep(recipeId: string, stepId: string) {
    setIsSubmiting(true);
    try {
      await repository.steps.deleteStep(recipeId, stepId);
      setModalConfirm(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        if (errorMessage === "Sessão inválida") {
          navigate("/signin");
          return;
        }
        toast.error(
          Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
          { toastId: "errorMessage" },
        );
        return;
      } else {
        toast.error("Erro interno no servidor", { toastId: "serverError" });
      }
    } finally {
      setIsSubmiting(false);
    }
  }
  useEffect(() => {
    if (!id) {
      toast.error("Id inválido");
      navigate("/home");
      return;
    }

    async function getRecipe() {
      try {
        const recipeData = await repository.recipe.findOne(id!);
        setRecipe(recipeData);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;

        if (errorMessage === "Sessão inválida") {
          navigate("/signin");
          return;
        }

        toast.error(errorMessage || "Erro interno no servidor", {
          toastId: "errorMessage",
        });
      }
    }

    getRecipe();
  }, [id, navigate, isSubmiting]);

  return (
    <main className="min-h-screen bg-background text-text font-body">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 scale-125"
          style={{
            backgroundImage: recipe?.urlImages?.[0]
              ? `url(${recipe.urlImages[0]})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(40px) brightness(0.7)",
          }}
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h1 className="font-title text-4xl md:text-5xl text-background">
              {recipe?.title}
            </h1>

            <p className="text-gray-300 text-lg max-w-2xl font-ui">
              {recipe?.description}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {recipe?.urlImages?.map((url, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-border bg-surface shadow-md"
                onClick={() => {
                  setFileUrl(url);
                  setModalImage(true);
                }}
              >
                <img
                  src={url}
                  className="w-full aspect-video object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-6">
        <div className="flex justify-between">
          <h2 className="font-title text-3xl text-primary">Passo a Passo</h2>{" "}
          <Button onClick={() => setModal(true)} variant="primary">
            <BiPlus />
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {!recipe?.steps || recipe?.steps.length === 0 ? (
            <p>Nenhum passo a passo adicionado</p>
          ) : (
            recipe?.steps?.map((step, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border border-border bg-surface shadow-sm"
              >
                <p className="font-ui text-sm text-secondary mb-2">
                  Etapa {step.order}
                </p>

                <p className="text-text">{step.content}</p>

                {step.observations && (
                  <p className="text-text-light text-sm mt-2">
                    {step.observations}
                  </p>
                )}
                <div className="text-right flex justify-end gap-3">
                  <Button
                    variant="danger"
                    onClick={() => {
                      setNameStep(`Etapa ${step.order}`);
                      setStepId(step.id);
                      setModalConfirm(true);
                    }}
                  >
                    <BiSolidTrash className="" />
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => {
                      setStep((prev) => ({ ...prev, ...step }));
                      setModalEdit(true);
                    }}
                  >
                    <BiPencil />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {modal && (
        <Modal onClose={() => setModal(false)}>
          <Modal.Header>
            <Modal.Title>Adicionar novo passo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Modal.Field>
              <Label>Novo passo</Label>
              <TextArea
                placeholder="Descrição do novo passo..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Modal.Field>
            <Modal.Field>
              <Label>Observações(opcional)</Label>
              <TextArea
                placeholder="Observações..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </Modal.Field>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => handleSubmitStep()}>
              {isSubmiting ? "Enviando..." : "Enviar"}
            </Button>
            <Button
              variant="danger"
              onClick={() => setModal(false)}
              disabled={isSubmiting}
            >
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {modalConfirm && (
        <Modal onClose={() => setModalConfirm(false)}>
          <Modal.Header>
            <Modal.Title>Deseja confirmar a remoção do passo?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Modal.Description>
              Essa remoção é permanente. Em caso de remoções acidentais, nada
              poderá ser feito. Deseja remover{" "}
              {nameStep ? `a ${nameStep}` : "o passo"}?
            </Modal.Description>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={isSubmiting}
              variant="outline-danger"
              onClick={() => {
                handleDeleteStep(id!, stepId);
              }}
            >
              {isSubmiting ? "Deletando..." : "Confirmar"}
            </Button>
            <Button variant="danger" onClick={() => setModalConfirm(false)}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {modalImage && (
        <Modal onClose={() => setModalImage(false)}>
          <img src={fileUrl} alt="imagem carregada" className="w-full" />
        </Modal>
      )}
      {modalEdit && (
        <Modal onClose={() => setModalEdit(false)}>
          <Modal.Header>
            <Modal.Title>Editar a Etapa {step?.order}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Modal.Field>
              <Label>Novo passo</Label>
              <TextArea
                placeholder="Descrição do novo passo..."
                value={step?.content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Modal.Field>
            <Modal.Field>
              <Label>Observações(opcional)</Label>
              <TextArea
                placeholder="Observações..."
                value={step?.observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </Modal.Field>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => handleSubmitStep()}>
              {isSubmiting ? "Enviando..." : "Enviar"}
            </Button>
            <Button
              variant="danger"
              onClick={() => setModalEdit(false)}
              disabled={isSubmiting}
            >
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </main>
  );
}
