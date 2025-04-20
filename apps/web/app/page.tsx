"use client";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collison";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Globe } from "@/components/ui/globe";
import { useRouter } from "next/navigation";
export default function Landing() {
  const router = useRouter();
  const words = [
    { text: "Welcome", className: " text-white text-3xl sm:text-4xl" },
    { text: "to", className: "text-white text-3xl sm:text-4xl" },
    { text: "Synapse.", className: "bg-gradient-to-b text-3xl sm:text-4xl from-slate-900 to-indigo-500 text-transparent bg-clip-text" },
  ];

  return (
    <div className="max-h-screen bg-gradient-to-b from-slate-900 to-black  ">
    <BackgroundBeamsWithCollision className=" sm:min-h-screen min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black">
      <div className="flex flex-col items-center text-white  mb-80 sm:mb-80">
      
        <TypewriterEffectSmooth
          words={words}
          className=" font-bold text-center "
        />
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <button onClick={()=>{
            router.push("/home");
          }} className="w-40 h-12 bg-gradient-to-tr from-pink-500 via-transparent to-indigo-500  hover:bg-gradient-to-br   hover:from-pink-500 hover:via-transparent  hover:to-indigo-500 transition-all  text-white text-sm rounded-3xl">
            Get Started
          </button>
    
        
        </div>
        <Globe className="sm:w-full   w-[80vh]  flex justify-center  max-w-4xl     bg-transparent mt-72" />
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" /> 
      </div>
      
    

    </BackgroundBeamsWithCollision>
    
    </div>

  );
}
