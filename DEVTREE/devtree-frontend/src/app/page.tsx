import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import "../styles/tailwind.css"; // Asegúrate de que esta ruta sea correcta

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-primary-green-lighter min-h-screen"> {/* Fondo ligero y altura mínima */}
        <Hero />
      </main>
    </>
  );
}