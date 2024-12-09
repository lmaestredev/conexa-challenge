<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar 
```
npm install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/
```
4. Clonar el archivo
```.env.template```
y renombrarlo a ```.env```
5. Levantar la base de datos
```
docker-compose up -d
```
6. Levantar ```npm run start:dev```

## Stack usado
* Nest
* Postgres
* Typeorm