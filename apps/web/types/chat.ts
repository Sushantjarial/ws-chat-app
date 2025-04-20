export interface Message {
  id: string
  content: string
  sender: string
  timestamp: string
  isSystem?: boolean
}

export interface Participant {
  name: string
  online: boolean
}
