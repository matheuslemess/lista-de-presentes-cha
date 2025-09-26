"use client";

import { useState, useEffect, Fragment } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import confetti from "canvas-confetti";
import { Gift, Heart, PackageCheck, PartyPopper, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";

interface Presente {
  id: string;
  nome: string;
  disponivel: boolean;
}

export default function HomePage() {
  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [loading, setLoading] = useState(true);
  const [presenteSelecionado, setPresenteSelecionado] =
    useState<Presente | null>(null);
  const [confirmado, setConfirmado] = useState(false);
  const [busca, setBusca] = useState("");
  const presentesFiltrados = presentes.filter((presente) =>
    presente.nome.toLowerCase().includes(busca.toLowerCase())
  );

  useEffect(() => {
    const q = query(
      collection(db, "presentes"),
      where("disponivel", "==", true)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const presentesData: Presente[] = [];
      querySnapshot.forEach((doc) => {
        presentesData.push({ id: doc.id, ...doc.data() } as Presente);
      });
      presentesData.sort((a, b) => a.nome.localeCompare(b.nome));
      setPresentes(presentesData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleConfirmarPresente = async () => {
    if (!presenteSelecionado) return;
    const presenteRef = doc(db, "presentes", presenteSelecionado.id);
    try {
      await updateDoc(presenteRef, { disponivel: false });
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      setConfirmado(true);
    } catch (error) {
      console.error("Erro ao atualizar o presente: ", error);
      alert("Ocorreu um erro ao selecionar o presente. Tente novamente.");
    }
  };

  const fecharModal = () => {
    setPresenteSelecionado(null);
    setConfirmado(false);
  };

  const numeroWhatsapp = "5567992559378";
  const mensagemWhatsapp = `Olá! Acabei de escolher o presente "${presenteSelecionado?.nome}" para o Chá de Panela e gostaria de deixar uma mensagem especial para os noivos...`;
  const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(
    mensagemWhatsapp
  )}`;

  return (
    <div className="min-h-screen">
      <audio
        src="/154.mp3"
        autoPlay
        loop
        controls
        style={{ display: "none" }}
      />

      <main className="container mx-auto max-w-4xl p-4 md:p-8">
        <header className="text-center mb-16 mt-8">
          <div className="inline-block bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-lg">
            <h1 className="text-2xl text-gray-500 tracking-widest uppercase">
              Nosso Chá de Panela
            </h1>
            <p className="font-dancing text-5xl sm:text-7xl text-rose-800 my-4">
              Thainá & Noivo
            </p>
            <div className="flex justify-center items-center gap-4 text-rose-400">
              <div className="flex-1 h-px bg-rose-200"></div>
              <Heart size={20} />
              <div className="flex-1 h-px bg-rose-200"></div>
            </div>
            <div className="mt-6 text-gray-600 max-w-lg mx-auto text-base">
              <p>
                Com o coração cheio de alegria, convidamos você a celebrar
                conosco! Sua presença é o nosso maior presente, mas se desejar
                nos agraciar com um mimo para nosso novo lar, preparamos esta
                lista com muito carinho.
              </p>
            </div>
          </div>
        </header>
        {/* Campo de pesquisa */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar presente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 placeholder-gray-400"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {Array(12)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white/80 rounded-2xl p-4 shadow-sm min-h-[120px] animate-pulse"
                >
                  <div className="w-10 h-10 bg-rose-100 rounded-full mx-auto mb-3"></div>
                  <div className="h-4 bg-rose-100 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {presentesFiltrados.map((presente) => (
              <button
                key={presente.id}
                onClick={() => setPresenteSelecionado(presente)}
                className="bg-white/80 border border-transparent rounded-2xl p-4 text-center shadow-sm md:hover:shadow-lg md:hover:border-rose-300 md:hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] group"
              >
                <Gift className="h-8 w-8 mb-3 text-rose-400 md:group-hover:scale-110 transition-transform" />
                <p className="font-medium text-gray-700 text-sm leading-tight">
                  {presente.nome}
                </p>
              </button>
            ))}
          </div>
        )}

        <Transition appear show={presenteSelecionado !== null} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={fecharModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/70" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left align-middle shadow-xl transition-all">
                    {!confirmado ? (
                      <div className="text-center">
                        <Dialog.Title
                          as="h3"
                          className="text-3xl font-bold text-gray-800 mb-4"
                        >
                          Confirmar Presente
                        </Dialog.Title>
                        <div className="text-lg my-6 p-4 bg-rose-50 text-rose-800 rounded-lg border border-rose-200">
                          <p>Você selecionou:</p>
                          <strong className="text-xl">
                            {presenteSelecionado?.nome}
                          </strong>
                        </div>
                        <a
                          href={linkWhatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-rose-600 hover:underline mb-8 block"
                        >
                          Quer deixar uma mensagem especial para os noivos?
                        </a>
                        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                          <button
                            onClick={fecharModal}
                            className="w-full justify-center flex items-center gap-2 py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200"
                          >
                            <X size={18} /> Cancelar
                          </button>
                          <button
                            onClick={handleConfirmarPresente}
                            className="w-full justify-center flex items-center gap-2 py-3 px-6 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-all duration-200 shadow-lg shadow-rose-500/30"
                          >
                            <PackageCheck size={18} /> Confirmar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <PartyPopper
                          size={48}
                          className="mx-auto text-rose-500 mb-4"
                        />
                        <Dialog.Title
                          as="h3"
                          className="text-4xl font-bold text-rose-800 mb-3"
                        >
                          Muito Obrigado!
                        </Dialog.Title>
                        <p className="text-gray-600 text-lg mb-8">
                          Seu presente foi confirmado com sucesso. Somos
                          imensamente gratos pelo seu carinho!
                        </p>
                        <button
                          onClick={fecharModal}
                          className="py-3 px-8 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-transform duration-200 hover:scale-105 shadow-lg shadow-rose-500/30"
                        >
                          Fechar
                        </button>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </main>
    </div>
  );
}
