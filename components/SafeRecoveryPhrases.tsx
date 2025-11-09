import React, { useContext, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useBlockContext } from "@/providers/Context";

interface Props {
  blockType: string;
}
const SafeRecoveryPhrases = (props: Props) => {
  const {
   handleSolanaOps,
   handleEtheriumOps
  } = useBlockContext();

  const inputRef = useRef<HTMLInputElement>(null);

  function handleGenerateWallet() {
    // check if the input has some value
    let phrases: string | string[] | undefined = inputRef.current?.value;

    if (phrases?.length) {
      phrases = phrases.split(" ");
      if (phrases.length < 12) {
        toast.error("Invalid phrase");
        return;
      }

      //start recovering the wallets here
    } else {

      switch (props.blockType) {
        case "solana":
           handleSolanaOps()
          break;
        case "etherium":
          handleEtheriumOps()
          break;
      }
    }
  }

  return (
    <div className="mt-15 space-y-2">
      <h1 className="font-bold tracking-tight text-5xl">
        Secret Recovery Phrase
      </h1>
      <h3 className="font-semibold tracking-tight text-xl dark:text-neutral-200 text-neutral-500">
        Save these words in a safe place
      </h3>
      <div className="flex gap-2 items-center">
        <Input
          ref={inputRef}
          type="password"
          className="h-10"
          placeholder="Enter/Paste your secret phrase (or leave blank to generate)"
        />
        <Button
          onClick={handleGenerateWallet}
          className="px-6 py-5 cursor-pointer"
        >
          Generate <span className="capitalize">{props.blockType}</span> Wallet
        </Button>
      </div>
    </div>
  );
};

export default SafeRecoveryPhrases;
