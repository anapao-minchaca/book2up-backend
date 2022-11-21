const express = require("express");
const usuarios = require("./schemas/usermodel");
const books = require("./schemas/bookmodel");

const app = express.Router();
const jwt = require('jsonwebtoken');
const userRoutes = require('./routes/userRoutes');

// desplegar libros en la pagina
app.get('/bookdata', async (req, res) => {
  const info = await books.find({});
  res.send(info);
})

// desplegar carrito en la pagina


// obtener info de libros --- ver para que sirve
app.post('/infoLibros', (req,res) => {
codigo = req.body.SKU;
nombre = req.body.titulo;
money = req.body.precio;
res.send('/a-carrito');
})

//registro
app.post("/signup", async (req, res) => {
    const{
      nombre,
      user,
      password,
    } = req.body;
  let usuario = await usuarios.findOne({user});
  if(!usuario){
    usuario = new usuarios({
      nombre,
      user,
      contra:password,
    });
    try {
      await usuario.save();
      const token = jwt.sign({ userId: usuario._id }, 'MY_SECRET_KEY');
      res.send({token});
    
    } catch (error) {
      res.status(404).send(error);
    }
    
  }else{
    res.send("Usuario existente");
  }
  });

//iniciar sesion
app.post('/validar', async (req,res) => {
  const{user, 
    password} = req.body;
  const usuario = await usuarios.findOne({user});
  const passwordValidation = await usuarios.findOne({contra:password});

  if(!usuario){
      res.status(422).send("No existe el usuario")
  }else{
    if(!passwordValidation){
      res.status(422).send("Password or user is incorrect")
    }
    else{
        const token = jwt.sign({ userId: usuario._id }, 'MY_SECRET_KEY');
        res.send({token});
      }
    }
  }
)

app.post('/validarAdmin', async (req,res) => {
  const{user, 
    password} = req.body;
  const usuario = await usuarios.findOne({user});
  const passwordValidation = await usuarios.findOne({contra:password});
  const admin = await usuarios.findOne({'user': 'admin'});

  if(!usuario){
      res.status(422).send("No existe el usuario")
  }else{
    if(!passwordValidation){
      res.status(422).send("Password or user is incorrect")
    }
    else{
      if(usuario.user == admin.user){
        const token = jwt.sign({ userId: usuario._id }, 'MY_SECRET_KEY');
        res.send({token});
      }
      else{
        res.status(422).send("No corresponde al administrador")
      }
    }
  }
})


app.use(userRoutes);
module.exports = app;
