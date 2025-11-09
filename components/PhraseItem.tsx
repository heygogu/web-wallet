import React from 'react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

interface PhraseProps{
    title:string
}
const PhraseItem = (props:PhraseProps) => {
  return (
    <div className='w-full max-w-sm'>
          <Item variant="outline" className='hover:bg-neutral-700 bg-neutral-900 p-4'>
        <ItemContent>
          <ItemTitle className='text-xl font-semibold'>{props.title}</ItemTitle>
          {/* <ItemDescription>
            A simple item with title and description.
          </ItemDescription> */}
        </ItemContent>
     
      </Item>
    </div>
  )
}

export default PhraseItem