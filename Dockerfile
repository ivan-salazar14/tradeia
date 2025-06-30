# Dockerfile para entorno Next.js + Tech Stack
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de Next.js
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "dev"] 