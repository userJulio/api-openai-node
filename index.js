import express from "express";
import router from './routes/rutas.js';
import fs from 'fs';
import cors from 'cors';
import https from 'https';
import dotenv from 'dotenv';


const app= express();

// Configurar cors
app.use(cors());
dotenv.config();

app.use(express.json()); 
app.use(express.urlencoded({extended:true})); // form-urlencoded

//app.use(express.static("imagenes/matematicas"));
app.use( express.static('imagenes/matematicas'));
//agregar router
app.use("/", router);

const port= process.env.PORT || 4001;

// https.createServer({
//     cert: fs.readFileSync('serverprueba.crt'),
//     key: fs.readFileSync('serverprueba.key')
// },app).listen(port, ()=>{
//     console.log(`Aplicacion funcionando en  HTTPS en el puerto ${port}`);
// });

//crear servidor y escuchar peticiones http
app.listen(port,()=>{
    console.log(`Aplicacion funcionando en  HTTP en el puerto ${port}`);
});