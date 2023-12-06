"use client";
import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { supabase } from "@/supabase/client";

const schema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "Sua senha tem pelo menos 6 caracteres" }),
});

type FormProps = z.infer<typeof schema>;

function Login() {
  const router = useRouter();
  const [requesting, setRequesting] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    router.refresh();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormProps> = async ({ email, password }) => {
    router.refresh();
    setRequesting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      router.refresh();
      router.push("/");
      return;
    }

    if (error.message == "Invalid login credentials") {
      setError("Email ou senha incorreta");
    } else {
      setError(error.message);
    }
    setRequesting(false);
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen px-4">
      <section className="bg-white text-black p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium">
              E-mail
            </label>
            <input
              type="text"
              id="email"
              className={`mt-1 p-2 w-full border  rounded-md ${
                errors.email ? "border-red-500" : "border-gray-400"
              }`}
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
              className={`mt-1 p-2 w-full border  rounded-md ${
                errors.password ? "border-red-500" : "border-gray-400"
              }`}
              {...register("password")}
            />

            <span className="text-red-500 text-sm">
              {errors.password?.message}
            </span>
          </div>

          <>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md active:bg-blue-400 flex items-center justify-center h-10"
              disabled={requesting}
            >
              {requesting ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Entrar"
              )}
            </button>
            <span className="text-red-500 text-sm">{error}</span>
          </>
        </form>
        {/* <GoogleLogin /> */}

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link
            href="signup"
            className="w-fit text-blue-600 hover:text-blue-800"
          >
            Cadastre-se
          </Link>
          <Link
            href="resetPassword"
            className="sm:text-right w-fit sm:ml-auto text-blue-600 hover:text-blue-800"
          >
            Esqueci a senha
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Login;
