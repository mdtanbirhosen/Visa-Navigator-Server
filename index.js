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
        await client.connect();
        
        //data base collections
        const database = client.db('VisasDB');
        const allVisaCollection = database.collection('allVisas') 

        // CRUD operations
        app.get('/visas', async(req, res) => {
            const cursor = allVisaCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // get single visa for details
        app.get('/visa/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await allVisaCollection.findOne(query)
            res.send(result)
        })


        app.post('/visas', async(req, res)=>{
            const newVisa = req.body;
            console.log("adding new visa", newVisa);
            const result = await allVisaCollection.insertOne(newVisa);
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('hello')
})

app.listen(port, () => {
    console.log(`Visa navigator is running on port : ${port}`);
})