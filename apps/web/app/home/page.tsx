"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquarePlus, LogIn, Sparkles } from "lucide-react"
import { BackgroundBeams } from "@/components/ui/background-beam"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collison"

export default function Home() {
  const router = useRouter()
  const [roomId, setRoomId] = useState("")
  const [roomName, setRoomName] = useState("")
  const [username, setUsername] = useState("")
  const [activeTab, setActiveTab] = useState("join")
  const [error, setError] = useState("")

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomId && username) {
      router.push(`/room/${roomId}?username=${encodeURIComponent(username)}`)
    }
  }

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username) {
      setError("Username is required")
      return
    }

    if (!roomName) {
      setError("Room name is required")
      return
    }

    // Create a slug from the room name
    const slug = roomName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")

    if (slug.length < 3) {
      setError("Room name must be at least 3 characters")
      return
    }

    // In a real app, you would check if the slug is unique here
    // For now, we'll just use it as the room ID
    router.push(`/room/${slug}?username=${encodeURIComponent(username)}`)
  }

  return (
    <div className="max-h-screen">

<div className=" flex items-center   w-screen h-full p-4 bg-gradient-to-r from-pink-800 via-black to-black">
<Sparkles className="w-8 h-8 mr-2 text-teal-400/80" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600

">
        Synapse
          </h1>
    </div>
    <div className="max-h-screen min-h-screen flex flex-col items-center justify-center  bg-gradient-to-r from-pink-800 via-black to-black text-white p-4 overflow-hidden relative">
   
      {/* Animated background elements - more subtle */}

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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 text-center relative z-10"
      >
        <motion.div
          className="flex items-center justify-center mb-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3,
          }}
        >
          <Sparkles className="w-8 h-8 mr-2 text-teal-400/80" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600

">
        Synapse
          </h1>
        </motion.div>
        <p className="text-gray-400"> Chat With Multiple People without saving there numbers </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md backdrop-blur-sm bg-gray-900/40 p-6 rounded-xl border border-gray-800/60 shadow-xl relative z-10"
      >
        <Tabs defaultValue="join" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800/30">
            <TabsTrigger
              value="join"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-800/50 data-[state=active]:to-teal-900/50"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Join Room
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-800/50 data-[state=active]:to-indigo-900/50"
            >
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              Create Room
            </TabsTrigger>
          </TabsList>

          <TabsContent value="join" className="space-y-4">
            <div className="space-y-2">
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800/30 border-gray-700/50 text-white  focus:outline-none focus:border-trasnparent"
                  required
                />
                <Input
                  type="text"
                  placeholder="Enter room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="bg-gray-800/30 border-gray-700/50 text-white focus:outline-none focus:border-trasnparent"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-700/80 to-teal-800/80 hover:from-teal-700/90 hover:to-teal-800/90 transition-all duration-300 border border-teal-600/20"
                >
                  Join Room
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-2">
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800/30 border-gray-700/50 text-white focus:outline-none focus:border-trasnparent"
                  required
                />
                <Input
                  type="text"
                  placeholder="Enter room name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="bg-gray-800/30 border-gray-700/50 text-white 0/40 focus:outline-none focus:border-trasnparent" 
                  required
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-300 text-sm"
                  >
                    {error}
                  </motion.p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-700/80 to-indigo-800/80 hover:from-indigo-700/90 hover:to-indigo-800/90 transition-all duration-300 border border-indigo-600/20"
                >
                  Create New Room
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          {activeTab === "join"
            ? "Don't have a room ID? Create a new room!"
            : "Create a unique name for your chat room"}
        </motion.div>
      </motion.div>

    </div>
    <BackgroundBeams  />

    </div>
  )
}
