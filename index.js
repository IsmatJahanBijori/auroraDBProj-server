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
    const cartsCollection = client.db("online_shopping").collection("carts");

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
      const bookData = req.body;
      const result = await booksCollection.insertOne(bookData);
      res.send(result)
    })


    // users
    app.post('/users', async (req, res) => {
      const usersInfo = req.body;
      const query = { email: usersInfo?.email }
      const existingUser = await usersCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'User Already Exists' })
      }
      const result = await usersCollection.insertOne(usersInfo);
      res.send(result)
    })

    app.get('/users', async (req, res) => {
      // const usersInfo=req.body;
      const result = await usersCollection.find().toArray();
      res.send(result)
    })


    //user admin
    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          role: 'Admin'
        },
      };

      const result = await usersCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    //user admin delete
    app.delete('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })

    //user admin get
    // app.get('/users/admin/:email', async (req, res) => {
    //   const email = req.params.email;

    //   // if (req.decoded.email !== email) {
    //   //   res.send({ admin: false })
    //   // }

    //   const query = { email: email }
    //   const user = await usersCollection.findOne(query);
    //   const result = { admin: user?.role === 'Admin' }
    //   res.send(result);
    // })

    //update item
    // app.put('/books/:id', async(req, res)=>{
    //   const id=req.params.id;
    //   const filter={ _id: new ObjectId(id) }
    //   const updateDoc = {
    //     $set: {
    //       title, subtitle, price
    //     },
    //   };

    //   const result = await booksCollection.updateOne(filter, updateDoc)
    //   res.send(result)
    // })

    //cart item
    app.post('/carts', async (req, res) => {
      const item = req.body;
      const result = await cartsCollection.insertOne(item)
      res.send(result)
    })
    
    //porer ta kaj na korle eta rekhe dibo
    // app.get('/carts', async (req, res) => {
    //   // const item = req.body;
    //   const result = await cartsCollection.find().toArray()
    //   res.send(result)
    // })

//TODO kaj korbo
    app.get('/carts', async (req, res) => {
      // const item = req.body;
      const email = req.query.email;
      if (!email) {
        res.send([]);
      }
      const query = { email: email };
      const result = await cartsCollection.find(query).toArray();
      res.send(result);
    })

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const query = { _id: new ObjectId(id) }
      // console.log(query)
      const result = await cartsCollection.deleteOne(query)
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