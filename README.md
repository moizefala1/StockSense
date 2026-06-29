# Instrucciones de ejecución

## Requisitos

- Node.js 20 o superior.
- npm, incluido con Node.js.

## Iniciar el proyecto

1. Descomprimir el archivo ZIP.
2. Abrir una terminal dentro de la carpeta que contiene `package.json`.
3. Instalar las dependencias:

```bash
npm ci
```

Si el comando anterior presenta problemas, utilizar:

```bash
npm install
```

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

5. Abrir en el navegador:

```text
http://localhost:3000
```

Para detener el servidor, presionar `Ctrl + C` en la terminal.

## Iniciar en modo de producción

```bash
npm run build
npm run start
```

Abrir `http://localhost:3000` en el navegador.

## Declaración de IA

Este README fue generado con apoyo de OpenAI Codex.
