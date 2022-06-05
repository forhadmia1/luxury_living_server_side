const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const jwt = require('jsonwebtoken');
const cors = require('cors')
const port = process.env.PORT || 5000;

//middleware use
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qhazz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const UsersCollection = client.db("Luxury_Living").collection("Users");

        app.put('/user', async (req, res) => {
            const user = req.body;
            const email = req.query.email;
            const filter = { email };
            const options = { upsert: true }
            const updateDoc = {
                $set: user
            }
            const result = await UsersCollection.updateOne(filter, updateDoc, options)
            const token = jwt.sign(user.email, process.env.ACCESS_TOKEN_SECRET)
            res.send({ result, token })
        })

        //get admin
        app.get('/admin', async (req, res) => {
            const email = req.query.email;
            const query = { email }
            const result = await UsersCollection.findOne(query)
            if (!result.role) {
                res.send({ isAdmin: false })
            } else {
                res.send({ isAdmin: true })
            }
        })


    }
    finally {
        // client.close()
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Welcome to Luxury Living')
})
app.listen(port, () => {
    console.log('listening port on', port)
})