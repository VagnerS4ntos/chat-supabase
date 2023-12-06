import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUsers } from "@/states/GlobalStates";
import { adminAuthClient } from "@/supabase/admin";

const schema = z.object({
  name: z
    .string()
    .min(2, { message: "Seu nome precisa ter pelo menos 2 caracteres" }),
});

type FormProps = z.infer<typeof schema>;

function ChangeName({ id }: { id?: string }) {
  const { currentUser, allUsers } = useUsers((state) => state);
  const [customError, setCustomError] = React.useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormProps>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormProps> = async ({ name }) => {
    if (
      name.toLowerCase().replace(/\s+/g, " ").trim() ==
      currentUser.name.toLowerCase()
    ) {
      setError("name", {
        type: "custom",
        message: "Você deve escolher um nome diferente do atual",
      });
      return;
    }

    const nameExists = allUsers.some(
      (user) =>
        user.name.toLowerCase() ===
        name.toLowerCase().replace(/\s+/g, " ").trim()
    );

    if (nameExists) {
      setError("name", {
        type: "custom",
        message: "Este nome já está em uso. Escolha outro",
      });
      return;
    }

    if (
      name
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
        .includes("usuário excluído") ||
      name.replace(/\s+/g, " ").trim().toLowerCase() == "você" || name.replace(/\s+/g, " ").trim().toLowerCase() == "voce"
    ) {
      console.log(name)
      setError("name", {
        type: "custom",
        message: "Nome inválido",
      });
      return;
    }

    const user_id = id || currentUser.id;
    const { error } = await adminAuthClient.updateUserById(user_id, {
      user_metadata: { name: name.replace(/\s+/g, " ").trim() },
    });

    if (error) {
      setCustomError(error.message);
      return;
    }
    toast.success("Nome atualizado com sucesso!");
    router.refresh();
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      resetField("name");
    }
  }, [isSubmitSuccessful]);

  return (
    <section className="max-w-sm mx-auto mt-5">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Nome"
          className="mt-1 p-2 w-full rounded-md text-black"
          {...register("name")}
        />
        <span className="text-red-500 text-sm">{errors.name?.message}</span>
        <button className="p-2 w-full rounded-md mt-3 bg-blue-500  hover:bg-blue-600">
          Atualizar
        </button>
        <span className="text-red-500 text-sm">{customError}</span>
      </form>
    </section>
  );
}

export default ChangeName;
