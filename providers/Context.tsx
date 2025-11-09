"use client";
import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import nacl from "tweetnacl";
import { HDNodeWallet, Mnemonic } from "ethers";

type Wallet = {
  publicKey: string;
  privateKey: string;
};

interface BlockContextType {
  solanaPhrase: string[];
  ethPhrase: string[];
  solanaWallets: Wallet[];
  ethWallets: Wallet[];
  setSolanaPhrase: Dispatch<SetStateAction<string[]>>;
  setEthPhrase: Dispatch<SetStateAction<string[]>>;
  setSolanaWallets: Dispatch<SetStateAction<Wallet[]>>;
  setEthWallets: Dispatch<SetStateAction<Wallet[]>>;
  handleSolanaOps: () => void;
  handleEtheriumOps: () => void;
}

const defaultContext: BlockContextType = {
  solanaPhrase: [],
  ethPhrase: [],
  solanaWallets: [],
  ethWallets: [],
  setSolanaPhrase: () => {},
  setEthPhrase: () => {},
  setSolanaWallets: () => {},
  setEthWallets: () => {},
  handleSolanaOps: () => {},
  handleEtheriumOps: () => {},
};

const BlockContext = createContext<BlockContextType>(defaultContext);

export const useBlockContext = () => {
  const context = useContext(BlockContext);
  if (context === undefined) {
    throw new Error("useCookieContext must be used within a CookieProvider");
  }
  return context;
};

export const BlockProvider = ({ children }: { children: React.ReactNode }) => {
  const [solanaPhrase, setSolanaPhrase] = useState<string[]>([]);
  const [ethPhrase, setEthPhrase] = useState<string[]>([]);

  const [solanaWallets, setSolanaWallets] = useState<Wallet[]>([]);
  const [ethWallets, setEthWallets] = useState<Wallet[]>([]);

  const handleSolanaOps = () => {
    let coinType = 501; // coin for solana
    let account = solanaWallets.length ?? 0;
    let mnemonic = generateMnemonic();
    setSolanaPhrase((prev) => {
      const newPhrase = mnemonic!.split(" ");
      localStorage.setItem(
        "solana-phrases",
        JSON.stringify([...prev, ...newPhrase])
      );
      return [...prev, ...newPhrase];
    });
    let seed = mnemonicToSeedSync(mnemonic);
    console.log(seed);
    let path = `m/44'/${coinType}'/${account}'/0'`;
    let derivedSeed = derivePath(path, seed.toString("hex")).key;
    let secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

    setSolanaWallets((prev) => {
      const newWallet = {
        publicKey: Keypair.fromSecretKey(secret!).publicKey.toBase58(),
        privateKey: Buffer.from(secret!).toString("hex"),
      };

      const updatedWallet = [...prev, newWallet];
      localStorage.setItem("solana-wallets", JSON.stringify(updatedWallet));
      return updatedWallet;
    });
  };

  const handleEtheriumOps = () => {
    let coinType = 60; // Ethereum
    let account = ethWallets.length ?? 0;

    let mnemonic = generateMnemonic();

    setEthPhrase((prev) => {
      const newPhrase = mnemonic!.split(" ");
      const updated = [...prev, ...newPhrase];
      localStorage.setItem("eth-phrases", JSON.stringify(updated));
      return updated;
    });

    let seed = mnemonicToSeedSync(mnemonic);

    let path = `m/44'/${coinType}'/${account}'/0/0`;

    let root = HDNodeWallet.fromSeed(seed);

    let wallet = root.derivePath(path);

    setEthWallets((prev) => {
      const newWallet = {
        publicKey: wallet.address,
        privateKey: wallet.privateKey,
      };

      const updatedWallets = [...prev, newWallet];
      localStorage.setItem("eth-wallets", JSON.stringify(updatedWallets));

      return updatedWallets;
    });
  };

 useEffect(() => {
  const sP = localStorage.getItem("solana-phrases");
  const sW = localStorage.getItem("solana-wallets");
  const eP = localStorage.getItem("eth-phrases");
  const eW = localStorage.getItem("eth-wallets");

  if (sP) setSolanaPhrase(JSON.parse(sP));
  if (sW) setSolanaWallets(JSON.parse(sW));

  if (eP) setEthPhrase(JSON.parse(eP));
  if (eW) setEthWallets(JSON.parse(eW));
}, []);

  return (
    <BlockContext.Provider
      value={{
        solanaPhrase,
        ethPhrase,
        solanaWallets,
        ethWallets,
        setSolanaPhrase,
        setEthPhrase,
        setSolanaWallets,
        setEthWallets,
        handleSolanaOps,
        handleEtheriumOps
      }}
    >
      {children}
    </BlockContext.Provider>
  );
};
