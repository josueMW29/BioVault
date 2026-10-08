# BioVault - Bóveda Privada React Native

BioVault es una aplicación móvil desarrollada en React Native y Expo que permite almacenar fotografías, videos y documentos en un entorno aislado y protegido mediante la autenticación biométrica nativa del dispositivo (Face ID / Touch ID).

## 🚀 Funcionalidades

- **Protección Biométrica:** Integración con `expo-local-authentication` para exigir huella dactilar o Face ID.
- **Bóveda Aislada:** Los archivos importados se copian al `documentDirectory` interno de la aplicación.
- **Bloqueo Automático:** La aplicación detecta cuando pasa a segundo plano (`AppState`) e inmediatamente bloquea la bóveda, exigiendo re-autenticación al volver.
- **Gestión de Archivos:** Importación mediante `expo-image-picker` y `expo-document-picker`.
- **Tema Oscuro Premium:** Interfaz moderna y segura.

## 🛠 Tecnologías Utilizadas

- **Framework:** React Native + Expo (SDK 50)
- **Lenguaje:** TypeScript
- **Navegación:** Expo Router
- **Almacenamiento Local:** `expo-file-system` y `expo-secure-store`
- **Biometría:** `expo-local-authentication`

## ⚙️ Requisitos Previos

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- App Expo Go en tu dispositivo móvil, o entorno configurado (Android Studio / Xcode).

## 📦 Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npx expo start
   ```

3. **Ejecutar en plataforma específica:**
   - **Android:** Pulsa `a` en la terminal (requiere emulador Android o dispositivo USB).
   - **iOS:** Pulsa `i` en la terminal (requiere macOS con Xcode simulador).

### ⚠️ Pruebas de Biometría

**Nota importante sobre simuladores:**
Para probar la autenticación biométrica en el **Simulador de iOS**, ve a la barra de menú del simulador: `Features > Face ID > Enrolled`, y luego para simular un escaneo exitoso: `Features > Face ID > Matching Face`. En el **Emulador de Android**, puedes configurar huellas dactilares desde las opciones de configuración extendidas (`...` > `Fingerprint`).
Para pruebas 100% reales, utiliza un **dispositivo físico** mediante Expo Go o un Development Build.

## 📁 Estructura del Proyecto

```
BioVault/
├── app/                  # Rutas de Expo Router
│   ├── _layout.tsx       # Root Layout (Proveedores de contexto)
│   ├── index.tsx         # Pantalla de bienvenida / Comprobación
│   ├── (auth)/           # Rutas públicas (Biometría)
│   └── (protected)/      # Rutas privadas (Bóveda)
├── src/
│   ├── components/       # Componentes UI reutilizables
│   ├── constants/        # Tema y colores
│   ├── context/          # Estado global (VaultContext)
│   ├── services/         # Lógica de negocio (Biometría, Archivos)
│   └── types/            # Interfaces TypeScript
└── app.json              # Configuración de Expo y Permisos
```

## 🔒 Consideraciones de Seguridad
- **Cifrado:** Esta versión inicial utiliza el aislamiento de la sandbox del sistema operativo (Document Directory) que es privado por aplicación. No incluye cifrado manual (AES) a nivel de byte en JS debido a limitaciones de rendimiento sin módulos nativos personalizados, garantizando una alternativa honesta y funcional.
- **Metadatos:** Los nombres y rutas se guardan en `SecureStore`.
