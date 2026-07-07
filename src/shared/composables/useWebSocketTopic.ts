import { onMounted, onUnmounted } from 'vue'
import type { StompSubscription } from '@stomp/stompjs'
import { stompClient, ensureConnected } from '../websocket/socketClient'

export function useWebSocketTopic<T>(topic: string, onMessage: (payload: T) => void) {
  let subscription: StompSubscription | null = null

  onMounted(async () => {
    await ensureConnected()
    subscription = stompClient.subscribe(topic, (message) => {
      onMessage(JSON.parse(message.body) as T)
    })
  })

  onUnmounted(() => {
    subscription?.unsubscribe()
  })
}