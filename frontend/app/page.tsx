"use client";

import { useEffect, useState } from "react";
import { getPessoas } from "../services/pessoas.service";
import { Pessoa } from "../types/pessoas";

export default function Home() {

  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {

    const data = await getPessoas({
    });

    setPessoas(data);
  }

  return (
    <div>
      <h1>Pessoas</h1>

      <ul>
        {pessoas.map((p) => (
          <li key={p.id}>{p.nome}</li>
        ))}
      </ul>

    </div>
  );
}