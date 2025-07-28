# Etapa 1: Construcción de la aplicación React
FROM node:18-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias y el proxy
COPY package.json ./
COPY package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Crear el build de producción
RUN npm run build

# Etapa 2: Servidor de producción (Nginx)
FROM nginx:stable-alpine

# Copiar los archivos estáticos construidos desde la etapa anterior
COPY --from=build /app/build /usr/share/nginx/html

# Copiar el archivo de configuración personalizado de Nginx
# (Lo crearemos en el siguiente paso)
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para que el servidor web sea accesible
EXPOSE 80

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
