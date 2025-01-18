import OpenAI  from "openai";
import fs from 'fs';
import path from "path";
import dotenv from 'dotenv';

dotenv.config();

const apikey=process.env.API_KEY_PROYECT;
const urlServidor='https://webapitest.aprendiendoconia-chatgpt.com/';
const openai = new OpenAI({ apiKey: apikey });



  const apiOpenAIConsultas=async(req,res)=>{

    const {mensajeOpenIA}=req.body;
    if(mensajeOpenIA.trim()==""){
      return  res.status(200).json({
           status:"error",
           mensaje:"Falta completar la consulta" 
        });

    }

    try {

        const response = await openai.chat.completions.create({
            messages: [
              { role: 'user', content: mensajeOpenIA.trim() }],
            model: 'gpt-4o-mini',
          });
          console.log("respuesta",response.choices[0].message);

       return  res.status(200).json({
            status:"success",
           resultadoIA: response.choices[0].message
        });
    } catch (error) {
    

      return  res.status(500).json({
            status:"error",
            mensaje:"Ocurrio un error en el sistema"
         });      
    }


};

const subirImagen=async (req,res)=>{

  // Recoger el fichero de imagen subido
  if (!req.file && !req.files) {
    return res.status(404).json({
        status: "error",
        mensaje: "Petición inválida"
    });
  }

// Nombre del archivo
let archivo = req.file.originalname;

// Extension del archivo
let archivo_split = archivo.split("\.");
let extension = String(archivo_split[1]).toLowerCase();

 if (extension != "png" && extension != "jpg" &&
        extension != "jpeg"){

     // Borrar archivo y dar respuesta
     fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
          status: "error",
          mensaje: "La imagen debe ser .png , .jog o .jpeg"
      });
    });
    
  }

return res.status(200).json({
  status:"success",
  imagen: archivo,
  imagenfile: req.file,
  extension:extension
});



};



const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let ruta_fisica = "./imagenes/matematicas/"+fichero;

  // fs.readFile(ruta_fisica, function(err, data) {
  //   if (err) throw err; // Fail if the file can't be read.
  //     res.writeHead(200, {'Content-Type': 'image/jpeg'});
  //     res.end(data); // Send the file data to the browser.
  // });

  fs.stat(ruta_fisica, (error, existe) => {
      if(existe) {
          return res.sendFile(path.resolve(ruta_fisica));
      }else{
          return res.status(404).json({
              status: "error",
              mensaje: "La imagen no existe",
              existe,
              fichero,
              ruta_fisica
          });
      }
  });
}


const consultarImagenIA= async (req,res)=>{

let archivo=req.file.filename;
const {preguntaai}=req.body;
let geturl= `./get-imagen/${archivo}` ;
try{

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', 
        content: [
            { type: "text", text: preguntaai.toString() },
            {
              type: 'image_url',
                image_url: {
                  url: geturl
                },
            }
        ],
      }],
  });

  let respuestaIA= response.choices[0].message;

  //Eliminar la imagen
  return  res.status(200).json({
    estado:"success",
   resultadoIA: respuestaIA
});

}catch(error){
  
    return res.status(500).json({
      estado:"error",
      resultado: "Hubo un error al procesar la solicitud "+ error.toString(),
      url: geturl
    });
}
  
}

export {
    apiOpenAIConsultas,
    consultarImagenIA,
    subirImagen,
    imagen
}

