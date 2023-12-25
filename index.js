const express = require('express')
const cors = require('cors');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d33r4qq.mongodb.net/?retryWrites=true&w=majority`;

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

    const taskCollection = client.db("taskManagement").collection("taskCollection");

    app.get('/create-task', async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    });

    app.post('/create-task', async (req, res) => {
        const task = req.body;
        const taskResult = await taskCollection.insertOne(task);
        res.send(taskResult)
      })

      app.delete('/create-task/:id', async(req, res) =>{
        const id = req.params.id;
        const query ={_id : new ObjectId(id)}
        const result = await taskCollection.deleteOne(query)
        res.send(result)
       })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})