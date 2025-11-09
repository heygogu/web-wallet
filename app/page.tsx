"use client";
import Header from "@/components/Header";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import KrolloSection from "@/components/KrolloSection";
import SafeRecoveryPhrases from "@/components/SafeRecoveryPhrases";
import { useBlockContext } from "@/providers/Context";
import PhraseListing from "@/components/PhraseListing";
export default function Home() {
  const [show, setShow] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const { solanaPhrase, ethPhrase, solanaWallets, ethWallets } =
    useBlockContext();

  function handleButtonClick(value: string) {
    setActiveTab(value);
    setShow(false);
  }

  useEffect(() => {
    if (solanaWallets.length > 0) {
      setActiveTab("solana");
      setShow(false);
    } else if (ethWallets.length > 0) {
      setActiveTab("etherium");
      setShow(false);
    }
  }, [solanaWallets, ethWallets]);

  return (
    <main className="min-h-screen pt-10">
      <div className="max-w-7xl mx-auto w-full px-2 ">
        <Header />

        {show && <KrolloSection handleButtonClick={handleButtonClick} />}

        {activeTab && (
          <Tabs defaultValue={activeTab} className="mt-6">
            <TabsList className="bg-transparent rounded-none border-b p-0 gap-3">
              <TabsTrigger
                className="bg-background text-lg data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
                value="solana"
              >
                Solana
              </TabsTrigger>
              <TabsTrigger
                className="bg-background text-lg data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none"
                value="etherium"
              >
                Etherium
              </TabsTrigger>
            </TabsList>
            <TabsContent value="solana" className="">
              {solanaWallets.length === 0 && (
                <SafeRecoveryPhrases blockType="solana" />
              )}

              {solanaPhrase.length > 0 && <PhraseListing blockType="solana" />}
            </TabsContent>
            <TabsContent value="etherium">
              {ethWallets.length === 0 && (
                <SafeRecoveryPhrases blockType="etherium" />
              )}
              {ethPhrase.length > 0 && <PhraseListing blockType="etherium" />}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
