"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Send, ArrowLeft, Copy, CheckCheck, Users } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import type { Message, Participant, SendMessage } from "@/types/chat"
import { generateRandomColor } from "@/lib/utils"
import { set } from "react-hook-form"

export default function ChatRoom() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isMobile = useMobile()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const slug = params.slug as string
  const userName = searchParams.get("userName") || "Anonymous"
  const roomToken = searchParams.get("roomToken") || ""
  const [participants,setParticipants]=useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)


  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [userColors, setUserColors] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)



  // Get or set user color
  useEffect(() => {
    if (!userColors[userName]) {
      setUserColors((prev) => ({
        ...prev,
        [userName]: generateRandomColor(),
        Alex: generateRandomColor(),
        Taylor: generateRandomColor(),
        Jordan: generateRandomColor(),
      }))
    }
  }, [userName, userColors])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const userId = localStorage.getItem("userId") || ""

    console.log("Room token:", roomToken)
    const ws = new WebSocket("ws://localhost:8080")

    socketRef.current = ws

    ws.onopen = () => {
      console.log(" WebSocket  connected")

      ws.send(
        JSON.stringify({
          type: "join",
          userId: userId,
          userName,
          roomToken,
        }),
      )
    }


    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "message") {
        setMessages((prev) => [...prev, data])
      } 
      console.log(data,"dataaaaa")
      if(data.participants){
       setParticipants(data.participants)
      }
      
      console.log("Message from server:", data)

    }


    ws.onclose = () => {
      console.log("🔌 WebSocket closed");
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {socketRef.current.send(
        JSON.stringify({
          type: "leave",
          userId: userId,
          userName,
          roomToken,
        })
        
      );}
    };


    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {socketRef.current.send(
        JSON.stringify({
          type: "leave",
          userId: userId,
          userName,
          roomToken,
        })
        
      );}
      console.log("WebSocket connection closed")
      if (socketRef.current) socketRef.current.close(); // Cleanup on unmount
    };
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      const newMessage: SendMessage = {
        data: message,
       userName: userName,
        type: "message",
        roomToken: roomToken,
        userId: localStorage.getItem("userId") || "",
      }
      socketRef.current?.send(JSON.stringify(newMessage))


      setMessage("")
    }
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(slug)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const goBack = () => {
    router.push("/")
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase()
  }

  // Update the return statement with enhanced UI
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background elements - more subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-between p-4 bg-gray-900/40 backdrop-blur-md border-b border-gray-800/40 z-10"
      >
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="mr-2 text-gray-400 hover:text-white hover:bg-gray-800/30"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-300/90 to-indigo-300/90">
              {slug}
            </h1>
            <p className="text-xs text-gray-400">Logged in as {userName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyRoomId}
                  className="text-gray-400 hover:text-white hover:bg-gray-800/30"
                >
                  {copied ? <CheckCheck className="h-5 w-5 text-teal-500/80" /> : <Copy className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy Room ID"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="text-gray-400 hover:text-white hover:bg-gray-800/30"
                >
                  <Users className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Participants</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.header>

      {/* Main chat area with participants sidebar */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className={`flex ${msg.sender === userName ? "justify-end" : "justify-start"} ${msg.isSystem ? "justify-center" : ""}`}
                >
                  {msg.isSystem ? (
                    <div className="bg-gray-800/30 backdrop-blur-sm text-gray-400 rounded-lg px-4 py-2 text-sm max-w-[80%] border border-gray-700/30">
                      {msg.message}
                    </div>
                  ) : (
                    <div
                      className={`flex ${msg.sender === userName ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[80%]`}
                    >
                      <Avatar className="w-8 h-8 border border-gray-700/30">
                        <AvatarFallback style={{ backgroundColor: userColors[msg.sender] || "#4B5563" }}>
                          {getInitials(msg.sender)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col ${msg.sender === userName ? "items-end" : "items-start"}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl backdrop-blur-sm ${msg.sender === userName
                              ? "bg-gradient-to-r from-teal-800/60 to-teal-900/60 text-white rounded-br-none border border-teal-700/20"
                              : "bg-gray-800/40 text-white rounded-bl-none border border-gray-700/30"
                            }`}
                        >
                          {msg.message}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span className="mr-1">{msg.sender}</span>
                          {/* <span>{formatTime(msg.timestamp)}</span>` */}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            className="p-4 bg-gray-900/40 backdrop-blur-md border-t border-gray-800/40"
          >
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800/30 border-gray-700/50 text-white focus:ring-teal-500/40 focus:border-teal-500/40"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-gradient-to-r from-teal-700/80 to-teal-800/80 hover:from-teal-700/90 hover:to-teal-800/90 transition-all duration-300 border border-teal-600/20"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Participants sidebar */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`${isMobile ? "absolute right-0 top-0 bottom-0 z-10" : "relative"} w-64 bg-gray-900/40 backdrop-blur-md border-l border-gray-800/40 overflow-y-auto`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-300/90 to-indigo-300/90">
                    Participants
                  </h2>
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowParticipants(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {participants?.map((participant,index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800/30"
                    >
                      <Avatar className="w-8 h-8 border border-gray-700/30">
                        <AvatarFallback style={{ backgroundColor: userColors[participant] || "#4B5563" }}>
                          {getInitials(participant)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{participant}</p>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full  bg-teal-500/80`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
