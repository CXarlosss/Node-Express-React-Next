"use client";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export const AuthTabs = () => {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="w-full max-w-md p-8 bg-black/80 rounded-xl shadow-lg">
      <div className="flex mb-6 space-x-4 justify-center">
        <button
          onClick={() => setTab("login")}
          className={`text-sm font-semibold px-4 py-2 rounded ${
            tab === "login" ? "bg-green-500 text-black" : "bg-gray-800 text-white"
          }`}
        >
          Inicia sesión
        </button>
        <button
          onClick={() => setTab("register")}
          className={`text-sm font-semibold px-4 py-2 rounded ${
            tab === "register" ? "bg-green-500 text-black" : "bg-gray-800 text-white"
          }`}
        >
          Regístrate
        </button>
      </div>

      {tab === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};
