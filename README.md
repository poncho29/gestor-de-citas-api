<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Gestor de Citas API

1. Clonar proyecto
2. Instalar dependencias ````yarn install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env.development```
4. Cambiar las variables de entorno
5. Debe tener docker instalado y ejecutando
5. Levantar la base de datos ```docker-compose --env-file .env.development up -d```
6. Ejecutar SEED ```http://localhost:4000/api/seed```
7. Ejecutar en modo desarrollo: ```yarn start:dev```