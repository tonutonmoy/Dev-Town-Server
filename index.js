const express = require('express');

const app = express();

const cors = require("cors")
require('dotenv').config();

const port = process.env.PORT || 5000;



app.use(cors())

app.use(express.json())



app.get('/', (req, res) => {


  res.send('hello world')

})




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.andsvfa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection


    const database = client.db("devTown");
    const allProducts = database.collection("products");


    // search all products

    app.get('/allProducts', async (req, res) => {

      const result = await allProducts.find().toArray();
      res.send(result)
    });



    // search single product

    app.get('/singleProduct/:id', async (req, res) => {
      try {
        const id = req?.params?.id;

        if (!id) {
          return
        }
        const result = await allProducts.findOne({ _id: new ObjectId(id) });



        res.send(result);




      } catch (error) {

        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
    });



    // search product by price category

    app.get('/category', async (req, res) => {

      const category = req?.query?.category;

      const result = await allProducts.find({ category: category }).toArray();
      res.send(result)
    });


    // search product by price

    app.post('/price', async (req, res) => {
      try {
        const { category, price } = req.body;



        if (category === "All") {
          const query = price ? { price: { $lte: parseFloat(price) } } : {};
          const result = await allProducts.find(query).toArray();
          return res.status(200).json(result);
        }

        const query = { category };

        if (price) {
          query.price = { $lte: parseFloat(price) };
        }

        const result = await allProducts.find(query).toArray();

        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });









    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log('port is running')
})