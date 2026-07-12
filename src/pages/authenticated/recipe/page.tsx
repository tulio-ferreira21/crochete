import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { repository } from "../../../repository/repository";
import { toast } from "react-toastify";
import type { Recipes, Step } from "../../../assets/types";
import Button from "../../../components/Button";
import { BiPencil, BiPlus, BiSolidTrash, BiTrash, BiX } from "react-icons/bi";
import { Modal } from "../../../components/Modal";
import { Label } from "../../../components/Label";
import { Input, TextArea } from "../../../components/Input";
import { motion, easeOut, type Variants, AnimatePresence } from "framer-motion";
import Loading from "../../../components/Loading";
import { BsThreeDots } from "react-icons/bs";
export default function Recipe() {
  const [recipe, setRecipe] = useState<Recipes | null>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [modalDeleteStep, setModalDeleteStep] = useState<boolean>(false);
  const [modalDeleteRecipe, setModalDeleteRecipe] = useState<boolean>(false);
  const [modalDeleteImage, setModalDeleteImage] = useState<boolean>(false);
  const [modalEditRecipe, setModalEditRecipe] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<boolean>(false);
  const [modalAddImage, setModalAddImage] = useState<boolean>(false);
  const [editImages, setEditImages] = useState<boolean>(false);
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [menuAction, setMenuActions] = useState<boolean>(false);
  const [images, setImages] = useState<File[]>([]);
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
      setModalDeleteStep(false);
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
  async function handleDeleteProject() {
    setIsSubmiting(true);
    try {
      await repository.recipe.deleteRecipe(id!);
      navigate("/home");
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
  async function handleEditProject() {
    setIsSubmiting(true);
    try {
      await repository.recipe.update({
        title: recipe?.title,
        description: recipe?.description,
        id: id,
      });
      toast.success("Projeto editado com successo");
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
  function handleChangeFile(Allfiles: FileList | null) {
    console.log(Allfiles);
    if (!Allfiles) return;
    setImages((prev) => {
      const newFiles = Array.from(Allfiles);
      console.log(newFiles);
      if (!prev) return prev;
      return [...prev, ...newFiles];
    });
    console.log("Arquivos: ", images);
  }
  async function handleUploadImages() {
    setIsSubmiting(true);
    try {
      await repository.recipe.uploadImages(images, id!);
      setImages([]);
      setModalAddImage(false);
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
  async function handleDeleteImages() {
    setIsSubmiting(true);
    try {
      await repository.recipe.deleteImage(fileUrl, id!);
      setModalDeleteImage(false)
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
  }, [id, navigate, isSubmiting, modalEditRecipe]);

  return isLoading ? (
    <Loading />
  ) : (
    <motion.main
      className="min-h-screen bg-gradient-to-b from-background via-[#F8F5EE] to-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onClick={() => {
        setMenuActions(false);
      }}
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
        <div className="flex justify-between items-center">
          <h2 className="font-title text-4xl text-primary mb-8">Galeria</h2>
          <Button
            variant={editImages ? "danger" : "primary"}
            onClick={() => setEditImages(!editImages)}
          >
            {editImages ? <BiX /> : <BiPencil />}
          </Button>
        </div>

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
          relative
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
              {editImages && (
                <div className="absolute top-1 right-1 rounded-full w-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileUrl(url);
                      setModalDeleteImage(true);
                    }}
                    className="bg-red-600 text-white p-2 text-xl rounded-full cursor-pointer hover:bg-red-700 transition duration-150"
                  >
                    <BiX />
                  </button>
                </div>
              )}
            </div>
          ))}
          {editImages && (
            <div
              className="
          cursor-pointer
          rounded-3xl
          border
          border-dashed
          border-gray-700
          group
          flex
          justify-center
          items-center
          hover:bg-gray-200
          transition
          duration-200
          "
              onClick={() => setModalAddImage(true)}
            >
              <div className="flex flex-col items-center">
                <BiPlus size={28} />
                <span className="text-logo tracking-[0.20em]">
                  Adicionar nova imagem
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        className="max-w-6xl mx-auto mt-20"
      >
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between mb-10">
          <div className="text-left">
            <h2 className="font-title text-5xl text-primary">Passo a passo</h2>

            <div className="mt-3 w-28 h-[2px] bg-gradient-to-r from-secondary via-accent to-rose rounded-full" />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="primary" onClick={() => setModal(true)}>
              <BiPlus />
            </Button>
            <div className="relative" id="menu__actions">
              <Button
                variant="outline-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuActions(!menuAction);
                }}
              >
                <BsThreeDots />
              </Button>
              {menuAction && (
                <motion.article
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  id="menu"
                  className="max-w-[300px] font-ui flex flex-col absolute p-2 gap-1 -left-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="success"
                    onClick={() => setModalEditRecipe(true)}
                  >
                    <span className="flex items-center gap-3">
                      <BiPencil />
                      Editar
                    </span>
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => setModalDeleteRecipe(true)}
                  >
                    <span className="flex items-center gap-3">
                      <BiTrash />
                      Apagar
                    </span>
                  </Button>
                </motion.article>
              )}
            </div>
          </div>
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
                        setModalDeleteStep(true);
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

      {modalDeleteStep && (
        <Modal onClose={() => setModalDeleteStep(false)}>
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
            <Button variant="danger" onClick={() => setModalDeleteStep(false)}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {modalDeleteRecipe && (
        <Modal onClose={() => setModalDeleteRecipe(false)}>
          <Modal.Header>
            <Modal.Title>Deseja realmente excluir o projeto?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Modal.Description>
              Essa remoção é permanente. Em caso de remoções acidentais, nada
              poderá ser feito. Deseja excluir o Projeto?
            </Modal.Description>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-danger"
              onClick={() => handleDeleteProject()}
              disabled={isSubmiting}
            >
              {isSubmiting ? (
                "Excluindo..."
              ) : (
                <span className="flex items-center gap-3">
                  {" "}
                  <BiTrash />
                  Confirmar
                </span>
              )}
            </Button>
            <Button
              variant="danger"
              onClick={() => setModalDeleteRecipe(false)}
            >
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
      {modalEditRecipe && (
        <Modal onClose={() => setModalEditRecipe(false)}>
          <Modal.Header>
            <Modal.Title>Editar Projeto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Modal.Field>
              <Label>Título</Label>
              <Input
                placeholder={recipe?.title}
                value={recipe?.title}
                onChange={(e) =>
                  setRecipe((prev) => {
                    if (!prev) return prev;
                    return { ...prev, title: e.target.value };
                  })
                }
              />
            </Modal.Field>
            <Modal.Field>
              <Label>Descrição</Label>
              <Input
                value={recipe?.description}
                onChange={(e) =>
                  setRecipe((prev) => {
                    if (!prev) return prev;
                    return { ...prev, description: e.target.value };
                  })
                }
              />
            </Modal.Field>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => handleEditProject()}
              variant="primary"
              disabled={isSubmiting}
            >
              {isSubmiting ? "Editando..." : "Editar"}
            </Button>
            <Button variant="danger" onClick={() => setModalEditRecipe(false)}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {modalAddImage && (
        <Modal onClose={() => setModalAddImage(false)}>
          <Modal.Header>
            <Modal.Title>Adicionar novas imagens</Modal.Title>
            <Modal.Body>
              <Modal.Field>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChangeFile(e.target.files)}
                />
              </Modal.Field>
              <div className="flex gap-3 flex-wrap">
                <AnimatePresence>
                  {images.map((file) => (
                    <motion.div
                      key={file.name}
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      whileHover={{
                        scale: 1.05,
                      }}
                      className="flex flex-col gap-2 items-center"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-[100px] rounded-xl"
                      />

                      <h1 className="text-sm text-gray-600">{file.name}</h1>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {images.length === 0 ? (
                ""
              ) : (
                <Button
                  variant="primary"
                  disabled={isSubmiting}
                  onClick={() => handleUploadImages()}
                >
                  {isSubmiting ? "Adicionando..." : "Adicionar"}
                </Button>
              )}
              <Button
                variant="danger"
                onClick={() => {
                  setModalAddImage(false);
                  setImages([]);
                }}
              >
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal.Header>
        </Modal>
      )}
      {modalDeleteImage && (
        <Modal onClose={() => setModalDeleteImage(false)}>
          <Modal.Header>
            <Modal.Title>Deseja excluir a imagem?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Modal.Description>
              Deseja excluir a imagem {fileUrl.split("/").pop()}? Essa ação é
              permanente e não poderá ser revertida
            </Modal.Description>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-danger"
              onClick={() => handleDeleteImages()}
              disabled={isSubmiting}
            >
              <span className="flex items-center gap-2">
                <BiTrash />
                {isSubmiting ? "Deletando" : "Confirmar"}
              </span>
            </Button>
            <Button onClick={() => setModalDeleteImage(false)} variant="danger">
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </motion.main>
  );
}
