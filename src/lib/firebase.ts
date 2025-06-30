import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
]

// Verificar variables de entorno
const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
if (missingVars.length > 0) {
  console.error('❌ Error: Faltan las siguientes variables de entorno de Firebase:', missingVars)
  throw new Error('Variables de entorno de Firebase no configuradas')
}

console.log('🔄 Iniciando conexión con Firebase...')

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app;
let messaging: any = null;

try {
  app = initializeApp(firebaseConfig)
  messaging = typeof window !== 'undefined' ? getMessaging(app) : null
} catch (error) {
  console.error('Error inicializando Firebase:', error)
}

// Función para solicitar permisos y obtener token
export const requestNotificationPermission = async () => {
  if (!messaging) {
    console.warn('⚠️ Firebase Messaging no está disponible')
    return null
  }

  try {
    console.log('🔄 Solicitando permisos de notificación...')
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      console.log('✅ Permisos de notificación concedidos')
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      })
      if (token) {
        console.log('✅ Token FCM obtenido correctamente')
        return token
      }
      console.warn('⚠️ No se pudo obtener el token FCM')
    } else {
      console.warn('⚠️ Permisos de notificación denegados')
    }
  } catch (error) {
    console.error('❌ Error solicitando permisos de notificación:', error)
  }
  return null
}

// Función para manejar mensajes en primer plano
export const onMessageListener = () => {
  if (!messaging) return () => {}

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })
} 