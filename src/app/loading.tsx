import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Loading() {
  return (
    <section className="container flex justify-center mt-5">
      <AiOutlineLoading3Quarters size="3em" className="animate-spin" />
    </section>
  );
}

export default Loading;
