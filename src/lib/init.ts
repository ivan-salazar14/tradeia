import { supabase } from './supabase'

export async function initializeServices() {
  console.log('🚀 Iniciando servicios...')
  
  try {
    // Verificar conexión con Supabase
    const { data, error } = await supabase.from('users').select('count').single()
    if (error) {
      throw error
    }
    console.log('✅ Conexión con Supabase establecida')
    
    // Verificar variables de entorno de Firebase
    const requiredFirebaseVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    ]
    
    const missingVars = requiredFirebaseVars.filter(varName => !process.env[varName])
    if (missingVars.length > 0) {
      console.warn('⚠️ Algunas variables de Firebase no están configuradas:', missingVars)
    } else {
      console.log('✅ Variables de Firebase verificadas')
    }
    
    return true
  } catch (error) {
    console.error('❌ Error inicializando servicios:', error)
    return false
  }
} 