"use client";
import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { supabase } from "@/supabase/client";
import { toast } from "react-toastify";

const schema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Seu nome precisa ter pelo menos 2 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, { message: "A senha precisa ter pelo menos 6 caracteres" }),
    password2: z.string(),
  })
  .refine((data) => data.password == data.password2, {
    path: ["password2"],
    message: "As senhas precisam ser iguais",
  });

type FormProps = z.infer<typeof schema>;

function SignUp() {
  const router = useRouter();
  const [requesting, setRequesting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormProps>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormProps> = async ({
    email,
    password,
    name,
  }) => {
    router.refresh();
    setRequesting(true);

    if (
      name
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()
        .includes("usuário excluído") ||
      name.replace(/\s+/g, " ").trim().toLowerCase() == "você" ||
      "voce"
    ) {
      setError("name", {
        type: "custom",
        message: "Nome inválido",
      });
      setRequesting(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name.replace(/\s+/g, " ").trim(),
        },
      },
    });
    if (!error) {
      router.refresh();
      router.push("/");
      return;
    }

    if (
      error.message ==
      'duplicate key value violates unique constraint "users_name_key"'
    ) {
      setError("name", {
        type: "custom",
        message: "Este nome já está em uso. Escolha outro",
      });
      setRequesting(false);
      return;
    }
    toast.error(error.message);
    setRequesting(false);
  };

  return (
    <main className="flex justify-center items-center h-screen px-4">
      <section className="bg-white text-black p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Cadastro</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium">
              Nome
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 w-full border border-gray-400 rounded-md"
              {...register("name")}
            />
            <span className="text-red-500 text-sm">{errors.name?.message}</span>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium">
              E-mail
            </label>
            <input
              type="text"
              id="email"
              className="mt-1 p-2 w-full border border-gray-400 rounded-md"
              {...register("email")}
            />
            <span className="text-red-500 text-sm">
              {errors.email?.message}
            </span>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-medium">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 w-full border border-gray-400 rounded-md"
              {...register("password")}
            />
            <span className="text-red-500 text-sm">
              {errors.password?.message}
            </span>
          </div>

          <div className="mb-4">
            <label htmlFor="password2" className="block font-medium">
              Repita a senha
            </label>
            <input
              type="password"
              id="password2"
              className="mt-1 p-2 w-full border border-gray-400 rounded-md"
              {...register("password2")}
            />
            <span className="text-red-500 text-sm">
              {errors.password2?.message}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 h-10 flex justify-center items-center"
            disabled={requesting}
          >
            {requesting ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2">
          <Link href="login" className="text-blue-600 hover:text-blue-800">
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}

export default SignUp;
