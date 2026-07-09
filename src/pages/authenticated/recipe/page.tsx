import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { repository } from "../../../repository/repository";
import { toast } from "react-toastify";
import type { Recipes, Step } from "../../../assets/types";
import Button from "../../../components/Button";
import { BiPencil, BiPlus, BiSolidTrash } from "react-icons/bi";
import { Modal } from "../../../components/Modal";
import { Label } from "../../../components/Label";
import { TextArea } from "../../../components/Input";
import { motion, easeOut, type Variants } from "framer-motion";
import Loading from "../../../components/Loading";
export default function Recipe() {
  const [recipe, setRecipe] = useState<Recipes | null>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [step, setStep] = useState<Step>();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [content, setContent] = useState<string>("");
  const [observations, setObservations] = useState<string>("");
  const [nameStep, setNameStep] = useState<string>("");
  const [stepId, setStepId] = useState<string>("");
  const { id } = useParams();
  const navigate = useNavigate();
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
  };

  const sectionVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };
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
          localStorage.clear();
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
  async function handleEditStep() {
    if (!content.trim()) {
      return toast.error("Informe o conteúdo do passo");
    }

    setIsSubmiting(true);

    try {
      await repository.steps.edit(
        {
          content,
          observations,
        },
        step!.id,
      );

      toast.success(`Etapa ${step?.order} editada com sucesso`);

      setModalEdit(false);
      setContent("");
      setObservations("");
      setStep(undefined);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;

      if (errorMessage) {
        if (errorMessage === "Sessão inválida") {
          localStorage.clear();
          navigate("/signin");
          return;
        }

        toast.error(
          Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
        );
      } else {
        toast.error("Erro interno no servidor");
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
          localStorage.clear();
          navigate("/signin");
          return;
        }

        toast.error(errorMessage || "Erro interno no servidor", {
          toastId: "errorMessage",
        });
      } finally {
        setIsLoading(false);
      }
    }

    getRecipe();
  }, [id, navigate, isSubmiting]);

  return isLoading ? (
    <Loading />
  ) : (
    <motion.main
      className="min-h-screen bg-gradient-to-b from-background via-[#F8F5EE] to-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative overflow-hidden rounded-[40px]"
      >
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: recipe?.urlImages?.[0]
              ? `url(${recipe.urlImages[0]})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(45px) brightness(.45)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#3A2F22]/60 via-[#3A2F22]/50 to-[#3A2F22]/80" />

        <div className="relative z-10 max-w-6xl mx-auto px-10 py-20">
          <span
            className="
        inline-block
        rounded-full
        bg-white/20
        backdrop-blur-md
        px-5
        py-2
        text-white
        text-sm
        uppercase
        tracking-[.25em]
        font-ui
        "
          >
            Projeto
          </span>

          <h1
            className="
        mt-6
        font-title
        text-6xl
        text-white
        leading-tight
        "
          >
            {recipe?.title}
          </h1>

          <p
            className="
        mt-5
        max-w-3xl
        text-lg
        text-[#F5EFE7]
        font-body
        leading-8
        "
          >
            {recipe?.description}
          </p>
        </div>
      </motion.section>
      <motion.section
        variants={sectionVariants}
        className="max-w-6xl mx-auto mt-12"
      >
        <h2 className="font-title text-4xl text-primary mb-8">Galeria</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {recipe?.urlImages?.map((url, index) => (
            <div
              key={index}
              onClick={() => {
                setFileUrl(url);
                setModalImage(true);
              }}
              className="
          cursor-pointer
          overflow-hidden
          rounded-3xl
          shadow-lg
          border
          border-border
          group
          "
            >
              <img
                src={url}
                className="
            aspect-[4/3]
            w-full
            object-cover
            transition
            duration-700
            group-hover:scale-110
            "
              />
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        className="max-w-6xl mx-auto mt-20"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-title text-5xl text-primary">Passo a passo</h2>

            <div className="mt-3 w-28 h-[2px] bg-gradient-to-r from-secondary via-accent to-rose rounded-full" />
          </div>

          <Button variant="primary" onClick={() => setModal(true)}>
            <BiPlus />
          </Button>
        </div>

        <div className="space-y-8">
          {!recipe?.steps?.length ? (
            <div
              className="
          rounded-3xl
          border
          border-dashed
          border-border
          bg-[#FFFDF8]
          py-16
          text-center
          "
            >
              <h3 className="font-title text-3xl text-primary">
                Nenhum passo cadastrado
              </h3>

              <p className="mt-3 text-text-light">
                Clique no botão "+" para adicionar o primeiro passo.
              </p>
            </div>
          ) : (
            recipe.steps.map((step) => (
              <div
                key={step.id}
                className="
            relative
            rounded-[30px]
            border
            border-border
            bg-[#FFFDF8]
            p-8
            shadow-sm
            transition
            hover:shadow-xl
            "
              >
                <div
                  className="
              absolute
              top-8
              left-8
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-primary
              text-white
              font-ui
              font-bold
              "
                >
                  {step.order}
                </div>

                <div className="ml-16">
                  <h3
                    className="
                font-title
                text-3xl
                text-primary
                "
                  >
                    Etapa {step.order}
                  </h3>

                  <p
                    className="
                mt-4
                leading-8
                text-text
                "
                  >
                    {step.content}
                  </p>

                  {step.observations && (
                    <div
                      className="
                  mt-6
                  rounded-2xl
                  bg-[#F6F2E8]
                  p-5
                  "
                    >
                      <p
                        className="
                    font-ui
                    text-sm
                    uppercase
                    tracking-widest
                    text-secondary
                    "
                      >
                        Observações
                      </p>

                      <p className="mt-2 text-text-light">
                        {step.observations}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 flex justify-end gap-3">
                    <Button
                      variant="success"
                      onClick={() => {
                        setStep(step);
                        setContent(step.content);
                        setObservations(step.observations || "");
                        setModalEdit(true);
                      }}
                    >
                      <BiPencil />
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => {
                        setNameStep(`Etapa ${step.order}`);
                        setStepId(step.id);
                        setModalConfirm(true);
                      }}
                    >
                      <BiSolidTrash />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.section>
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
                placeholder={step?.content}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Modal.Field>
            <Modal.Field>
              <Label>Observações(opcional)</Label>
              <TextArea
                placeholder={step?.observations || "Observações..."}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </Modal.Field>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={isSubmiting}
              variant="primary"
              onClick={() => handleEditStep()}
            >
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
    </motion.main>
  );
}
