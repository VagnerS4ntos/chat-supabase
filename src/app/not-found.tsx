import React from "react";
import Link from "next/link";

function NotFoundPage() {
  return (
    <>
      <main className="container mt-5">
        <h2 className="text-xl">404 - Página não encontrada</h2>
        <Link href="/" className="hover:text-blue-600">
          Clique aqui para voltar
        </Link>
      </main>
    </>
  );
}

export default NotFoundPage;
