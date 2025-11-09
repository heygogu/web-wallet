import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useBlockContext } from '@/providers/Context'
import PhraseItem from './PhraseItem'
const PhraseListing = (props:{blockType:string}) => {

    const {solanaPhrase,ethPhrase} = useBlockContext()
    
  return (
     <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1" className='  rounded-lg border py-4 px-10 mt-2'>
        <AccordionTrigger className='text-3xl font-bold tracking-tight'>Your Secret Phrase</AccordionTrigger>
        <AccordionContent className="grid grid-cols-4 gap-4 text-balance mt-4">
         {
            props.blockType === "solana" ? 
            
            solanaPhrase.map((phrase:string,index:number)=>{
              return <PhraseItem key={index} title={phrase} />
            }) : ethPhrase.map((phrase:string,index:number)=>{
              return <PhraseItem key={index} title={phrase} />
            })
         }

         
        </AccordionContent>
      </AccordionItem>
      </Accordion>
  )
}

export default PhraseListing