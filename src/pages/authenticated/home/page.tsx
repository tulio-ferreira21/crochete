import { useEffect, useState } from "react";
import type { User } from "../../../assets/types";
import Button from "../../../components/Button";
import { BiPlus } from "react-icons/bi";
import { Card } from "../../../components/Card";
import { Modal } from "../../../components/Modal";
import { Label } from "../../../components/Label";
import { Input, TextArea } from "../../../components/Input";
import { toast } from "react-toastify";
import { repository } from "../../../repository/repository";
import { Link, useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../../../assets/formatTimeAgo";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "../../../components/Loading";
export default function Home() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isValidFields, setIsValidFields] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [modal, setModal] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  function handleChangeFile(Allfiles: FileList | null) {
    console.log(Allfiles);
    if (!Allfiles) return;
    setFiles((prev) => {
      const newFiles = Array.from(Allfiles);
      console.log(newFiles);
      return [...prev, ...newFiles];
    });
    console.log("Arquivos: ", files);
  }

  async function handleSubmit() {
    setIsSubmiting(true);
    try {
      await repository.recipe.create({
        description,
        title,
        files,
      });
      setTitle("");
      setDescription("");
      setFiles([]);
    } catch (error) {
      toast.error("Erro ao adicionar novo projeto");
    } finally {
      setIsSubmiting(false);
    }
  }
  useEffect(() => {
    if (title && description) {
      setIsValidFields(true);
    } else {
      setIsValidFields(false);
    }
  }, [title, description, isSubmiting]);

  useEffect(() => {
    async function getAllDataUser(): Promise<User | undefined | false | any> {
      if (!token) {
        navigate("/signin");
        return;
      }
      try {
        const user = await repository.user.get(token);
        const recipes = await repository.recipe.findMany();
        if (!user) {
          navigate("/signin");
          return;
        }
        setUser((prev) => ({
          ...prev,
          email: user.email,
          id: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          recipes: recipes || ["item"],
        }));
        console.log(recipes);
        console.log(user);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage) {
          if (errorMessage === "Sessão inválida") {
            localStorage.clear();
            navigate("/signin");
            return;
          }
          toast.error(errorMessage, { toastId: "errorMessage" });
          return;
        } else {
          toast.error("Erro interno no servidor", { toastId: "serverError" });
        }
      } finally {
        setIsLoading(false);
      }
    }

    getAllDataUser();
  }, []);
  return isLoading ? (
    <Loading />
  ) : (
    <main className="px-4 pt-6 flex flex-col gap-3">
      <header className="flex justify-around flex-col-reverse gap-5 sm:flex-row">
        <h2 className="font-logo text-4xl tracking-[0.12em] text-primary">
          Meus Projetos
        </h2>

        <Button variant="primary" onClick={() => setModal(true)}>
          <span className="flex gap-2 items-center text-shadow-text-light justify-center">
            <BiPlus />
            Projeto
          </span>
        </Button>
      </header>
      {!user?.recipes || user.recipes.length == 0 ? (
        <p className="text-gray-400 p-6 text-center">
          Nenhum projeto criado. Aperte em "+ Projeto" para criar
        </p>
      ) : (
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-5
    gap-2 
  "
        >
          {user?.recipes.map((project) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 25,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              whileHover={{
                y: -6,
              }}
              transition={{
                duration: 0.35,
              }}
            >
              <Link to={`/recipe/${project.id}`} className="block h-full">
                <Card>
                  <Card.Image urlImage={project.urlImages?.[0]} />
                  <Card.Content>
                    <Card.Title>{project.title}</Card.Title>

                    <Card.Subtitle>{project.description}</Card.Subtitle>
                  </Card.Content>

                  <Card.Footer>
                    <p className="font-ui text-sm text-text-light">
                      {formatTimeAgo(project.createdAt)}
                    </p>
                  </Card.Footer>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.section>
      )}

      {modal && (
        <Modal onClose={() => setModal(false)}>
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 30,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <Modal.Header>
              <Modal.Title>Adicionar novo projeto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Modal.Field>
                <Label>Título</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Ouro do Brasil"
                />
              </Modal.Field>
              <Modal.Field>
                <Label>Descrição</Label>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Camisa do brasil com pontas"
                />
              </Modal.Field>
              <Modal.Field>
                <Label>Imagens</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    handleChangeFile(e.target.files);
                  }}
                />

                <div className="flex gap-3 flex-wrap">
                  <AnimatePresence>
                    {files.map((file) => (
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
              </Modal.Field>
              <Modal.Footer>
                {isValidFields && (
                  <Button
                    onClick={handleSubmit}
                    variant="primary"
                    disabled={isSubmiting}
                  >
                    {isSubmiting ? "Adicionando..." : "Adicionar"}
                  </Button>
                )}
                <Button
                  variant="outline-danger"
                  onClick={() => setModal(false)}
                >
                  Cancelar
                </Button>
              </Modal.Footer>
            </Modal.Body>
          </motion.div>
        </Modal>
      )}
    </main>
  );
}
