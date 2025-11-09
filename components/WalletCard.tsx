import React, { use, useState } from "react";
import { Button } from "./ui/button";
import { DeleteIcon, Eye, EyeClosed, EyeClosedIcon, EyeOffIcon, Trash } from "lucide-react";
import { useBlockContext } from "@/providers/Context";

interface WalletCardProps {
  index: number;
  publicKey: string;
  privateKey: string;
  blockType: string;
}
const WalletCard = (props: WalletCardProps) => {
  const [isPrivateVisible, setIsPrivateVisible] = useState(false);
  const {handleDeleteSolanaWalletByIndex,handleDeleteEthWalletByIndex}=useBlockContext()

  function handleToggle() {
    setIsPrivateVisible(!isPrivateVisible);
  }

  function handleDelete(){
    switch(props.blockType){
      case "solana":
        handleDeleteSolanaWalletByIndex(props.index)
        break;
      case "ethereum":
        handleDeleteEthWalletByIndex(props.index)
        break;
    }
  }

  return (
    <div className="w-full space-y-6 border-2 rounded-xl pt-6">
      <div className="flex justify-between items-center px-10">
        <h2 className="font-bold text-3xl">Wallet {props.index + 1}</h2>
        <Button onClick={handleDelete} className="cursor-pointer" variant={"ghost"}>
            <Trash className="text-red-500"/>
        </Button>
      </div>
      <div className="dark:bg-neutral-900 bg-neutral-50 rounded-xl space-y-6 px-10 py-8">
        <div className="space-y-2">
          <h3 className="text-xl tracking-tight font-bold"> Public Key</h3>
          <p className="font-medium tracking-tight dark:text-neutral-300 text-neutral-700">
            {props.publicKey}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl tracking-tight font-bold">Private Key</h3>
          <div className="flex justify-between items-center">
            {!isPrivateVisible ? (
             <p className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate">
                ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
              </p>
            ) : (
              <p className="font-medium dark:text-neutral-300 text-neutral-700">
                {props.privateKey}
              </p>
            )}
            <Button variant={"ghost"} onClick={handleToggle}>
              {isPrivateVisible ? <EyeOffIcon/> :<Eye/>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
