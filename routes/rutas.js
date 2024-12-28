import express from "express";
import {apiOpenAIConsultas,consultarImagenIA,subirImagen,imagen} from '../controllers/openIAController.js';
import multer from "multer";

const router= express.Router();


const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './imagenes/matematicas/');
    },

    filename: function(req, file, cb){
        cb(null, "imagen-" + Date.now() + file.originalname);
    }
});
const subidas = multer({storage: almacenamiento});


router.post("/consultarAI",apiOpenAIConsultas);
router.post("/subir-imagen",subidas.single("file0"),subirImagen);
router.get("/get-imagen/:fichero",imagen );
router.post("/consultarByImage",subidas.single("file0"),consultarImagenIA);

export default router;