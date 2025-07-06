"use client";

import Image from "next/image";
import type { NextPage } from "next";
import SimpleSwapApp from "~~/components/SimpleSwapApp";
import "~~/styles/globals.css";

// Ensure global styles are imported

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <Image
              id="logoethkipu"
              src="/ethkipu-logo.svg"
              alt="Scaffold-ETHKIPU Logo"
              className="mx-auto mb-4 w-64 h-32"
              width={256}
              height={128}
              priority
            />
            <span className="block text-4xl font-bold">Developer Ethereum & Talento Tech 💻🚀</span>
          </h1>
          <div className="my-2">
            <SimpleSwapApp />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
