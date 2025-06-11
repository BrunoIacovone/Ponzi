# --- Etapa de Build ---
# Esta etapa instala todas las dependencias y compila el código.
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Verificación para depuración: nos aseguramos de que el build generó los archivos.
RUN ls -la /app/dist

# --- Etapa Final de Producción ---
# Esta etapa crea la imagen final, que será más pequeña y segura.
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copiar los artefactos de la compilación desde la etapa de build.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/firebase-service-account.json ./firebase-service-account.json

# Instalar únicamente las dependencias de producción basadas en el package-lock.json.
# Esto es más rápido y seguro que copiar toda la carpeta node_modules.
RUN npm install --omit=dev

EXPOSE 3000

# El comando ahora se ejecuta desde /app.
CMD [ "node", "dist/src/main.js" ]
