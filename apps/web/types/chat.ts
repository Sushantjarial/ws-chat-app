export interface Message {
  type: string
  message: string
  sender: string
  roomId: string
  isSystem?: boolean
  participants?: string[]
}

export interface Participant {
  userName: string
  online?: boolean
}

export interface SendMessage {
  type: "message"
  data: string
  userName: string
  roomToken: string
  userId: string

}