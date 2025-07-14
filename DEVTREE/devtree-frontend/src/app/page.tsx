import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import "../styles/tailwind.css";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <Hero />
      </main>
    </>
  );
}
