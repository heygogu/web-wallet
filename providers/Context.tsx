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

export type Wallet = {
  publicKey: string;
  privateKey: string;
};

interface BlockContextType {
  solanaPhrase: string;
  ethPhrase: string;
  solanaWallets: Wallet[];
  ethWallets: Wallet[];
  setSolanaPhrase: Dispatch<SetStateAction<string>>;
  setEthPhrase: Dispatch<SetStateAction<string>>;
  setSolanaWallets: Dispatch<SetStateAction<Wallet[]>>;
  setEthWallets: Dispatch<SetStateAction<Wallet[]>>;
  handleSolanaOps: () => void;
  handleEthereumOps: () => void;
  handleDeleteSolanaWalletByIndex: (index: number) => void
  handleDeleteEthWalletByIndex: (index: number) => void
  createSolanaWallet: () => void
  createEthWallet: () => void
  deleteAllWallets: (blockType:string) => void
}

const defaultContext: BlockContextType = {
  solanaPhrase: "",
  ethPhrase: "",
  solanaWallets: [],
  ethWallets: [],
  setSolanaPhrase: () => {},
  setEthPhrase: () => {},
  setSolanaWallets: () => {},
  setEthWallets: () => {},
  handleSolanaOps: () => {},
  handleEthereumOps: () => {},
  handleDeleteSolanaWalletByIndex: () => {},
  handleDeleteEthWalletByIndex: () => {},
  createSolanaWallet: () => {},
  createEthWallet: () => {},
  deleteAllWallets: () => {},
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
  const [solanaPhrase, setSolanaPhrase] = useState<string>("");
  const [ethPhrase, setEthPhrase] = useState<string>("");

  const [solanaWallets, setSolanaWallets] = useState<Wallet[]>([]);
  const [ethWallets, setEthWallets] = useState<Wallet[]>([]);

 const handleSolanaOps = () => {
  // if we don't yet have a mnemonic, create one; else reuse
  const mnemonic = solanaPhrase || generateMnemonic();
  if (!solanaPhrase) {
    setSolanaPhrase(mnemonic);
    localStorage.setItem("solana-phrase", JSON.stringify(mnemonic));
  }

  const seed = mnemonicToSeedSync(mnemonic);

  setSolanaWallets((prev) => {
    const account = prev.length; // always up-to-date
    const path = `m/44'/501'/${account}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

    const newWallet = {
      publicKey: Keypair.fromSecretKey(secret).publicKey.toBase58(),
      privateKey: Buffer.from(secret).toString("hex"),
    };

    const updated = [...prev, newWallet];
    localStorage.setItem("solana-wallets", JSON.stringify(updated));
    return updated;
  });
};

const handleEthereumOps = () => {
  const mnemonic = ethPhrase || generateMnemonic();
  if (!ethPhrase) {
    setEthPhrase(mnemonic);
    localStorage.setItem("eth-phrase", JSON.stringify(mnemonic));
  }

  const seed = mnemonicToSeedSync(mnemonic);
  const root = HDNodeWallet.fromSeed(seed);

  setEthWallets((prev) => {
    const account = prev.length; // always up-to-date
    const path = `m/44'/60'/${account}'/0/0`;
    const wallet = root.derivePath(path);

    const newWallet = {
      publicKey: wallet.address,
      privateKey: wallet.privateKey,
    };

    const updated = [...prev, newWallet];
    localStorage.setItem("eth-wallets", JSON.stringify(updated));
    return updated;
  });
};

  const createSolanaWallet = () => {
  if (!solanaPhrase) return; // or generate one intentionally
  const seed = mnemonicToSeedSync(solanaPhrase);

  setSolanaWallets((prev) => {
    const account = prev.length;
    const path = `m/44'/501'/${account}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;

    const newWallet = {
      publicKey: Keypair.fromSecretKey(secret).publicKey.toBase58(),
      privateKey: Buffer.from(secret).toString("hex"),
    };
    const updated = [...prev, newWallet];
    localStorage.setItem("solana-wallets", JSON.stringify(updated));
    return updated;
  });
};

const createEthWallet = () => {
  if (!ethPhrase) return;
  const seed = mnemonicToSeedSync(ethPhrase);
  const root = HDNodeWallet.fromSeed(seed);

  setEthWallets((prev) => {
    const account = prev.length;
    const path = `m/44'/60'/${account}'/0/0`;
    const wallet = root.derivePath(path);

    const newWallet = {
      publicKey: wallet.address,
      privateKey: wallet.privateKey,
    };
    const updated = [...prev, newWallet];
    localStorage.setItem("eth-wallets", JSON.stringify(updated));
    return updated;
  });
};



 const handleDeleteSolanaWalletByIndex = (index: number) => {
  setSolanaWallets((prev) => {
    const updated = prev.filter((_, i) => i !== index);
    localStorage.setItem("solana-wallets", JSON.stringify(updated));
    if (updated.length === 0) {
      localStorage.removeItem("solana-phrase");
      setSolanaPhrase("");
    }
    return updated;
  });
};

const handleDeleteEthWalletByIndex = (index: number) => {
  setEthWallets((prev) => {
    const updated = prev.filter((_, i) => i !== index);
    localStorage.setItem("eth-wallets", JSON.stringify(updated));
    if (updated.length === 0) {
      localStorage.removeItem("eth-phrase");
      setEthPhrase("");
    }
    return updated;
  });
};

function deleteAllWallets(blockType: string) {
  if (blockType === "solana") {
    setSolanaWallets([]);
    localStorage.removeItem("solana-wallets");
    setSolanaPhrase("");
    localStorage.removeItem("solana-phrase");
  } else if (blockType === "ethereum") {
    setEthWallets([]);
    localStorage.removeItem("eth-wallets");
    setEthPhrase("");
    localStorage.removeItem("eth-phrase");
  }
}


 useEffect(() => {
  const sP = localStorage.getItem("solana-phrases");
  const sW = localStorage.getItem("solana-wallets");
  const eP = localStorage.getItem("eth-phrases");
  const eW = localStorage.getItem("eth-wallets");

  if (sP) {
    const value = JSON.parse(sP);
    setSolanaPhrase(Array.isArray(value) ? value.join(" ") : value);
  }

  if (eP) {
    const value = JSON.parse(eP);
    setEthPhrase(Array.isArray(value) ? value.join(" ") : value);
  }
  if (sW) setSolanaWallets(JSON.parse(sW));
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
        handleEthereumOps,
        handleDeleteSolanaWalletByIndex,
        handleDeleteEthWalletByIndex,
        createSolanaWallet,
        createEthWallet,
        deleteAllWallets
      }}
    >
      {children}
    </BlockContext.Provider>
  );
};
