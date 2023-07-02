const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config();

//middle ware
app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-euh9qdo-shard-00-00.hbyxuz9.mongodb.net:27017,ac-euh9qdo-shard-00-01.hbyxuz9.mongodb.net:27017,ac-euh9qdo-shard-00-02.hbyxuz9.mongodb.net:27017/?ssl=true&replicaSet=atlas-ny4qda-shard-0&authSource=admin&retryWrites=true&w=majority`;

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
    await client.connect();

    const booksCollection = client.db("online_shopping").collection("book_catalog");
    const usersCollection = client.db("online_shopping").collection("users");

    // books
    app.get('/books', async (req, res) => {
      const result = await booksCollection.find().toArray();
      res.send(result)
    })


    app.get('/books/:id', async (req, res) => {
      const id = req.params.id;
      const bookId = { _id: new ObjectId(id) }
      const result = await booksCollection.findOne(bookId);
      res.send(result)
    })

    app.post('/books', async (req, res) => {
      const bookData=req.body;
      const result = await booksCollection.insertOne(bookData);
      res.send(result)
    })


    // users
    app.post('/users', async (req, res) => {
      const usersInfo=req.body;
      const result = await usersCollection.insertOne(usersInfo);
      res.send(result)
    })

    app.get('/users', async (req, res) => {
      // const usersInfo=req.body;
      const result = await usersCollection.find().toArray();
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Online shopping School!')
})

app.listen(port, () => {
  console.log(`Online shopping is listening on port ${port}`)
})