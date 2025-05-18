const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.xttfi9y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// MongoClient config
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // Connect to MongoDB
    await client.connect();
    const coffeeCollection = client.db('coffeeDB').collection('coffees');

    console.log("Connected to MongoDB");

    // POST endpoint to add coffee
    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      console.log('Received new coffee:', newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // get for view all api at display endpoint to add coffee
    app.get('/coffees', async (req, res) => {
      const result = await coffeeCollection.find().toArray()
      res.json(result);
    });

    // get for view deteals at display endpoint to add coffee
    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })


  } catch (err) {
    console.error('Connection error:', err);
  }
}

run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
  res.send('Coffee server is getting hotter!');
});

// Start server
app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`);
});
