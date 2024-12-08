const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 4000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q5jln.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    //   await client.connect();
      // Send a ping to confirm a successful connection
    //   await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");


      const database = client.db('VisasDB');
        const allVisaCollection = database.collection('allVisas')
        const appliedVisaCollection = database.collection('appliedVisas')

        // CRUD operations
        app.get('/visas', async (req, res) => {
            const cursor = allVisaCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // get single visa for details
        app.get('/visa/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allVisaCollection.findOne(query)
            res.send(result)
        })
        // my added visas get operation
        app.get('/visas/:email', async (req, res) => {
            const email = req.params.email;
            const query = { addByEmail: email };
            const cursor = allVisaCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        // appliedVisas get operation
        app.get('/appliedVisas/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = appliedVisaCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })


        // post operation for all visa
        app.post('/visas', async (req, res) => {
            const newVisa = req.body;
            console.log("adding new visa", newVisa);
            const result = await allVisaCollection.insertOne(newVisa);
            res.send(result)
        })

        // appliedVisas post operation
        app.post('/appliedVisas', async (req, res) => {
            const newAppliedVisa = req.body;
            console.log("user applied for visa: ", newAppliedVisa);
            const result = await appliedVisaCollection.insertOne(newAppliedVisa);
            res.send(result)
        })


        // update a visa using patch
        app.patch('/visa', async (req, res) => {
            const id = req.body._id;
            const filter = { _id: new ObjectId(id) };
            const updatedVisa = {
                $set: {
                    countryName: req.body?.countryName,
                    countryImage: req.body?.countryImage,
                    visaType: req.body?.visaType,
                    processingTime: req.body?.processingTime,
                    requiredDocuments: req.body?.requiredDocuments,
                    description: req.body?.description,
                    ageRestriction: req.body?.ageRestriction,
                    fee: req.body?.fee,
                    validity: req.body?.validity,
                    applicationMethod: req.body?.applicationMethod,
                }
            }
            const result = await allVisaCollection.updateOne(filter, updatedVisa);
            res.send(result)
        })

        // delete a visa from my added visas
        app.delete('/visa/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allVisaCollection.deleteOne(query);
            res.send(result)
        })
        // appliedVisas delete operation
        app.delete('/appliedVisas/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await appliedVisaCollection.deleteOne(query);
            res.send(result)
        })
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('hello')
})

app.listen(port, () => {
    console.log(`Visa navigator is running on port : ${port}`);
})



