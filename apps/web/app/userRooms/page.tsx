"use client";

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

import { Sparkles, Trash2, LogIn } from "lucide-react"
import { BackgroundBeams } from "@/components/ui/background-beam"
import axios from "axios"
import { Navbar } from "@/components/ui/navbar"

import { useToast } from "@/components/ui/use-toast";

// Dummy rooms data
const dummyRooms = [
  { id: "1", name: "General Chat (dummy room)", slug: "general-chat", members: 5 },
  { id: "2", name: "Team Meeting(dummy room)", slug: "team-meeting", members: 3 },
  { id: "3", name: "Project Discussion(dummy room)", slug: "project-discussion", members: 4 },
  { id: "4", name: "Random Chat (dummy room)", slug: "random-chat", members: 2 },
]

export default function UserRooms() {
  const { toast } = useToast()
  const router = useRouter()
  const [userRooms, setUserRooms] = useState(dummyRooms)
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const userId = localStorage.getItem("userId")


    if (!userId) {
      router.push("/")
      return
    }
    setUserId(userId)
    const res=axios.get(`http://localhost:8000/rooms?userId=${userId}`)
    res.then((res)=>{
      console.log(res.data.rooms)
      if(res.data.rooms.length===0){
        setUserRooms(dummyRooms)
    alert("No rooms found for this user")

      }
      else{
        setUserRooms(res.data.rooms)
      }
    })


  }, [])

  const handleDeleteRoom = (roomId: string) => {
    // In a real app, you would make an API call here
    setUserRooms(prevRooms => prevRooms.filter(room => room.id !== roomId))
  }

  return (
    <div className="max-h-screen min-h-screen bg-gradient- bg-black from-slate-900 to-black ">
     <Navbar name="Back to home"></Navbar>

      <div className="max-h-screen flex flex-col items-center justify-center   text-white p-4 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none max-h-screen">
          <motion.div
            className="absolute -top-40 -left-40 w-80 h-80 bg-teal-900/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-900/10 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, -20, 0],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 2,
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl backdrop-blur-sm bg-gray-900/40 p-6 rounded-xl border border-gray-800/60 shadow-xl relative z-10"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">Your Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userRooms.map((room) => (
              <motion.div
                key={room.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-2 text-teal-400">{room.name}</h3>
                <p className="text-gray-400 mb-2">Room ID: {room.slug}</p>
                <p className="text-gray-400 mb-4">Members: {room.members}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push(`/room/${room.slug}?username=${encodeURIComponent("Admin")}`)}
                    className="flex-1 bg-gradient-to-r from-teal-700/80 to-teal-800/80 hover:from-teal-700/90 hover:to-teal-800/90 transition-all duration-300 border border-teal-600/20"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                  <Button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="bg-gradient-to-r from-rose-700/80 to-rose-800/80 hover:from-rose-700/90 hover:to-rose-800/90 transition-all duration-300 border border-rose-600/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {userRooms.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">You haven't created any rooms yet.</p>
              <Button
                onClick={() => router.push("/")}
                className="mt-4 bg-gradient-to-r from-indigo-700/80 to-indigo-800/80 hover:from-indigo-700/90 hover:to-indigo-800/90 transition-all duration-300 border border-indigo-600/20"
              >
                Create Your First Room
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      <BackgroundBeams />
    </div>
  )
}
