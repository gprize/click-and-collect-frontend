import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL ?? 'http://localhost:8080/ws'

export const stompClient = new Client({
  webSocketFactory: () => new SockJS(WS_BASE_URL),
  reconnectDelay: 5000
})

export function ensureConnected(): Promise<void> {
  if (stompClient.active) return Promise.resolve()
  return new Promise((resolve) => {
    stompClient.onConnect = () => resolve()
    stompClient.activate()
  })
}