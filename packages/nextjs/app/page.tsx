"use client";

import type { NextPage } from "next";
import SimpleSwapApp from "~~/components/SimpleSwapApp";

const Home: NextPage = () => {

  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <div className="px-2">
          <div className="flex justify-center items-center space-x-2 flex-row">
            <h2 className="my-2 font-medium">Welcome to EthKipu</h2>
          </div>
          <div className="flex justify-center items-center space-x-2 flex-row">
            <SimpleSwapApp />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
