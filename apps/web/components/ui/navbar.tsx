import { Sparkles } from "lucide-react";
import {useRouter} from "next/navigation";
import { Button } from "@/components/ui/button"



export function Navbar({name}:{name:string} ){
    const router = useRouter()
    return(
        <div className="flex z-50  bg-gradient-to-b from-slate-900 to-black  bg-opacity-0 items-center w-screen h-full p-4 px-6 justify-between border-0">
        <div className="flex">
          <Sparkles className="w-8 h-8 mr-2 text-teal-400/80" />
          <h1 className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
            Synapse
          </h1>
        </div>
        <Button 
          onClick={() => router.push("/home")}
          className="z-50 rounded-2xl bg-gradient-to-br from-pink-800 via-black to-blue-500 hover:bg-transparent-to-tb hover:from-blue-500 hover:via-black hover:to-pink-800"
        >
        {name}
        </Button>
      </div>
    )
}