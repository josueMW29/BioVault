# BioVault

BioVault es una aplicación móvil desarrollada en React Native y Expo que permite almacenar y consultar fotografías, videos y documentos privados en un espacio protegido mediante autenticación biométrica (Huella dactilar / Face ID).

## Funcionalidades

- **Autenticación Biométrica:** Protege el acceso a la app utilizando Face ID, Touch ID o la biometría nativa de Android.
- **Almacenamiento Aislado:** Los archivos se copian al directorio de documentos aislado (*sandboxed*) de la aplicación, haciéndolos inaccesibles desde fuera de la app sin acceso root.
- **Importación de Medios y Documentos:** Soporte para importar fotos, videos y documentos.
- **Bloqueo Automático:** La aplicación se bloquea automáticamente al pasar a segundo plano, requiriendo autenticación al volver a abrirla.
- **Visor Integrado:** Permite visualizar imágenes de forma nativa. Los videos se reproducen mediante `expo-video` y los documentos se comparten de forma segura al visor del sistema operativo.

## Tecnologías Utilizadas

- **React Native & Expo SDK 57**
- **Expo Router:** Enrutamiento basado en archivos.
- **TypeScript:** Tipado estricto.
- **Expo Local Authentication:** Verificación biométrica nativa.
- **Expo File System:** Almacenamiento local aislado.
- **Expo Secure Store:** Almacenamiento seguro de preferencias críticas.
- **Expo Image Picker / Document Picker:** Selección de archivos.
- **Lucide React Native:** Iconos modernos.
- **Jest & React Native Testing Library:** Pruebas automatizadas.

## Consideraciones de Seguridad y Limitaciones Conocidas

- **Cifrado de Archivos (Limitación):** Debido a limitaciones técnicas para implementar criptografía AES-256 eficiente sobre archivos binarios pesados (como videos) sin crear módulos nativos complejos desde cero o depender de librerías desactualizadas en Expo Go, la aplicación utiliza el **App Sandboxing del Sistema Operativo** como principal medida de protección para los archivos en reposo. Esto cumple con los estándares de seguridad modernos para proteger la información contra otros usuarios y aplicaciones.
- **Eliminación:** Si se desinstala la aplicación, los archivos almacenados en la bóveda se eliminarán de forma permanente.

## Requisitos Previos

- Node.js (v18 o superior).
- Expo CLI.
- Dispositivo físico o emulador con biometría configurada.
- macOS (exclusivo para compilar en iOS localmente).

## Instalación y Ejecución

1. Extrae el archivo ZIP.
2. Abre una terminal en la carpeta raíz del proyecto `BioVault`.
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo de Expo:
   ```bash
   npm start
   ```

### Ejecutar en Android (Windows / macOS / Linux)

Para probarlo en tu dispositivo físico Android:
1. Descarga la aplicación **Expo Go** desde la Google Play Store.
2. Asegúrate de que tu teléfono y tu computadora estén en la misma red Wi-Fi.
3. Ejecuta `npm run android` o escanea el código QR que aparece en la terminal con la cámara de tu dispositivo.

### Ejecutar en iOS (Requiere macOS para emulador, o iPhone con Expo Go)

Para probarlo en tu iPhone:
1. Descarga **Expo Go** desde la App Store.
2. Escanea el código QR de la terminal usando la cámara de tu iPhone.

*Nota:* Para probar el Face ID correctamente y evitar limitaciones de Expo Go, se recomienda generar un Development Build.

### Generar un Development Build

Si requieres probar las capacidades nativas sin las restricciones de Expo Go:
```bash
npm install -g eas-cli
eas login
eas build --profile development --platform android # Para Android
eas build --profile development --platform ios # Para iOS
```

## Estructura de Carpetas

```text
BioVault/
├── app/
│   ├── (auth)/        # Pantallas de autenticación (Lock screen)
│   ├── (protected)/   # Pantallas de la bóveda (Home, Visores)
│   ├── _layout.tsx    # Layout raíz (proveedores)
│   ├── index.tsx      # Lógica de redirección inicial
│   └── settings.tsx   # Configuración de bloqueo
├── src/
│   ├── components/    # Componentes UI (Botones, Tarjetas, Estado Vacío)
│   ├── services/      # Lógica de negocio (Biometría, Archivos, SecureStore)
│   ├── context/       # Estado global (VaultContext)
│   ├── types/         # Interfaces TypeScript
│   ├── constants/     # Tema y colores
│   └── utils/         # Funciones auxiliares
├── tests/             # Pruebas automatizadas (Jest)
└── assets/            # Imágenes e iconos base
```

## Pruebas Automatizadas

El proyecto incluye pruebas unitarias para los servicios principales. Para ejecutarlas:

```bash
npm test
```

## Problemas Frecuentes y Soluciones

- **No aparece la solicitud biométrica en el emulador:** Asegúrate de ir a las opciones extendidas de tu emulador Android o Simulador iOS y configurar una huella o rostro (Face ID "Enrolled") antes de probar.
- **La aplicación se cierra al seleccionar un documento:** Revisa los permisos en tu dispositivo. Expo Go suele pedirlos automáticamente, pero en versiones de producción deberás aceptarlos en el diálogo inicial.
