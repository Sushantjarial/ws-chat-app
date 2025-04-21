export interface Message {
  type: string
  message: string
  sender: string
  roomId: string
  isSystem?: boolean
}

export interface Participant {
  name: string
  online: boolean
}

export interface SendMessage {
  type: "message"
  data: string
  userName: string
  roomToken: string
  userId: string
}