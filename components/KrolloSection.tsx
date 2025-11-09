import React from "react";
import { Button } from "./ui/button";

interface KrolloProps {
  handleButtonClick: (value: string) => void;
}
const KrolloSection = (props: KrolloProps) => {
  return (
    <div className="mt-18 space-y-2">
      <h1 className="font-bold tracking-tight text-5xl">
        krollo supports multiple blockchains
      </h1>
      <h3 className="font-semibold tracking-tight text-xl dark:text-neutral-200 text-neutral-700">
        Choose a blockchain to get started
      </h3>
      <div className="flex gap-2 mt-3">
        <Button
          onClick={() => props.handleButtonClick("solana")}
          className="px-8 py-6 cursor-pointer"
          size={"default"}
        >
          Solana
        </Button>
        <Button
          onClick={() => props.handleButtonClick("ethereum")}
          className="px-8 py-6 cursor-pointer"
          size={"lg"}
        >
          Ethereum
        </Button>
      </div>
    </div>
  );
};

export default KrolloSection;
