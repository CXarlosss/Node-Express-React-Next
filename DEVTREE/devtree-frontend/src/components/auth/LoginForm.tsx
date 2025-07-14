"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    console.log("Login", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      <Input label="Contraseña" type="password" {...register("password")} error={errors.password?.message} />
      <Button type="submit">Entrar</Button>
    </form>
  );
};
