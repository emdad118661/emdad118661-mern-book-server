const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json());

//x9qjIo66nLp5U4h0
//i2BJytB29QFK68Pj


app.get('/', (req, res) => {
    res.send('Hello World!')
});


// MongoDB connection
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI;

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

        //create a collection
        const bookCollection = client.db("BookInventory").collection("books");

        //insert a book to the database : post method
        app.post("/upload-book", async (req, res) => {
            const data = req.body;
            const result = await bookCollection.insertOne(data);
            res.send(result);
        })

        //get all books from the database : get method
        // app.get("/all-books", async (req, res) => {
        //     const books = bookCollection.find();
        //     const result = await books.toArray();
        //     res.send(result);
        // })

        //update a book : patch method
        app.patch("/book/:id", async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const updateBookData = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                   ...updateBookData
                },
            };

            const result = await bookCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        //delete a book : delete method
        app.delete("/book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const result = await bookCollection.deleteOne(filter);
            res.send(result);
        })

        //find by category : get method
        app.get("/all-books", async(req, res) => {
            let query = {};
            if(req.query?.category){
                query = {category: req.query.category}
            }
            const result = await bookCollection.find(query).toArray();
            res.send(result);
        })

        //get a single book by id : get method
        app.get("/book/:id", async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const result = await bookCollection.findOne(filter);
            res.send(result);
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



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})