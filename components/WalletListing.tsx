import React from "react";
import { Button } from "./ui/button";
import { useBlockContext, Wallet } from "@/providers/Context";
import WalletCard from "./WalletCard";

interface WalletListingProps {
  blockType: string;
}
const WalletListing = (props: WalletListingProps) => {
  const {solanaWallets,ethWallets,createSolanaWallet,createEthWallet,deleteAllWallets}= useBlockContext()

  const handleAddWallet = () => {
    if (props.blockType === "solana") {
      createSolanaWallet();
    } else if (props.blockType === "ethereum") {
      createEthWallet();
    }
  }

  const handleDeleteAllWallets = () => {
    deleteAllWallets(props.blockType)
  }
  return (
    <div className="mt-20 space-y-5">
      <div className="flex justify-between">
        <h1 className="font-bold tracking-tight text-4xl">
          <span className="capitalize">{props?.blockType} Wallet</span>
        </h1>

        <div className="flex gap-2">
          <Button
            onClick={() => handleAddWallet()}
            className="px-6 py-5 cursor-pointer"
            size={"lg"}
          >
            Add Wallet
          </Button>
          <Button
            variant={"destructive"}
            onClick={() => handleDeleteAllWallets()}
            className="px-6 py-5 cursor-pointer"
            size={"lg"}
          >
            Clear Wallets
          </Button>
        </div>
      </div>

      {
        props.blockType === "solana" ? (
          <div className="space-y-5">
            {solanaWallets.map((wallet: Wallet, index: number) => (
              <WalletCard key={index} index={index} publicKey={wallet.publicKey} privateKey={wallet.privateKey} blockType="solana" />
            ))}
          </div>
        ):(
          <div className="space-y-5">
            {ethWallets.map((wallet: Wallet, index: number) => (
              <WalletCard key={index} index={index} publicKey={wallet.publicKey} privateKey={wallet.privateKey} blockType="ethereum" />
            ))}
          </div>
        )
      }
    </div>
  );
};

export default WalletListing;
