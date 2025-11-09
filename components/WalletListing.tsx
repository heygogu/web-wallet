import React from 'react'
import { Button } from './ui/button'

interface WalletListingProps{
    addToWallet:(blockType:string) => void
}
const WalletListing = (props:WalletListingProps) => {
  return (
    <div className="mt-20 space-y-2">
      <h1 className="font-bold tracking-tight text-5xl">
        krollo supports multiple blockchains
      </h1>
      <h3 className="font-semibold tracking-tight text-xl dark:text-neutral-200 text-neutral-500">
        Choose a blockchain to get started
      </h3>
      <div className="flex gap-2">
        <Button
          onClick={() => props.addToWallet("solana")}
          className="px-6 py-5 cursor-pointer"
          size={"lg"}
        >
          Solana
        </Button>
        <Button
          onClick={() => props.addToWallet("etherium")}
          className="px-6 py-5 cursor-pointer"
          size={"lg"}
        >
          Etherium
        </Button>
      </div>
    </div>
  )
}

export default WalletListing