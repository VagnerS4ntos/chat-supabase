import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { adminAuthClient } from "@/supabase/admin";
import { useUsers } from "@/states/GlobalStates";

const schema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

type FormProps = z.infer<typeof schema>;

function ChangeEmail({ id }: { id?: string }) {
  const { currentUser, allUsers } = useUsers((state) => state);
  const [customError, setCustomError] = React.useState("");

  const {
    register,
    handleSubmit,
    resetField,
    setError,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormProps>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormProps> = async ({ email }) => {
    const emailExists = allUsers.some(
      (user) => user.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (emailExists) {
      setError("email", {
        type: "custom",
        message: "Email já em uso",
      });

      return;
    }

    const user_id = id || currentUser.id;
    const { error } = await adminAuthClient.updateUserById(user_id, {
      email,
    });

    if (error) {
      setCustomError(error.message);
    }
    toast.success("Email atualizado com sucesso!");
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      resetField("email");
    }
  }, [isSubmitSuccessful]);

  return (
    <section className="max-w-sm mx-auto mt-5">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Email"
          className="mt-1 p-2 w-full rounded-md text-black"
          {...register("email")}
        />
        <span className="text-red-500 text-sm">{errors.email?.message}</span>
        <button className="p-2 w-full rounded-md mt-3 bg-blue-500 hover:bg-blue-600">
          Atualizar
        </button>
        <span className="text-red-500 text-sm">{customError}</span>
      </form>
    </section>
  );
}

export default ChangeEmail;
