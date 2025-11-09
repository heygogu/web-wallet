"use client"
import { useEffect, useState } from "react";

export function useRecoveryPhrase(){
    const [phrases,setPhrases] = useState();

    useEffect(()=>{
        const it= localStorage.getItem("phrases")
        console.log(it)
    },[])

    return {phrases,setPhrases};
}