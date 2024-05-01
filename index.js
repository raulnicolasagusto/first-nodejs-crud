const express = require('express')
const app = express()
const mongoose = require('mongoose');
app.use(express.json()); // esta linea sirve para cuando usamos insomnia, al momento de probar el envio POST, le cargamos un json y funciona.
// sino nos muestra undefined en la consola
const Product = require('./models/product.model');

//conectamos con la base de datos de mongo DB
mongoose.connect("mongodb+srv://ruloagusto:156730278Ra@backenddb.tjojfye.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB")
  .then(() => {
    console.log('Connected!');
    app.listen(3000, ()=>{
        console.log('Server Running on port 3000')
    });
})

  .catch(()=>{
    console.log('NO se pudo conectar')
  });

  app.get('/', (req, res)=>{
    res.send('HOla probando');
});

//Agregamos un producto ( CREAR)
app.post('/api/products', async (req,res)=>{
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
});

//Leer, Buscar, encontrar un producto (READ)
app.get('/api/products', async (req,res)=>{
  try {
    const product = await Product.find({});
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
});


//Encontramos solo un producto para luego poder eliminar o actualizar
app.get('/api/product/:id', async (req,res)=>{
  try {
    const { id } = req.params; // en este caso, definimos id como constante pero entre llaves
    // ya que esto nos permite acceder a una propiedad del objeto. Nosotros necesitamos el id
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});


//Actualizando el producto ( UPDATE )

app.put('/api/product/:id', async (req,res)=>{
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
          if (!product) {
            res.status(404).json({message: "No se encontro el producto"});
          }
          const updatedProduct = await  Product.findById(id);

    } catch (error) {
      res.status(505).json({message: error.message});
    }

  }) ;

  
//Eliminado producto (DELETE) ( NO FUNCIONA 1/5/24, REVISAR )

app.delete('api/product/:id', async (req,res)=>{
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({message: "No se encontro el producto"})
    }

    res.status(200).json({message: "Producto eliminado"})

  } catch (error) {
    res.status(505).json({message: error.message});
  }
});