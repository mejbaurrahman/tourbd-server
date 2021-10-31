const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvker.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
       console.log('connected');
       const database = client.db("tourBD");
       const offerCollections = database.collection("offerCollection");
       const orderCollections = database.collection('orderCollection');
        //  get api for getting offers info 
       app.get('/offers', async (req, res)=>{
        const result = offerCollections.find({});
        const offer = await result.toArray();
        console.log(offer);
        res.json(offer);
      });
      app.get('/offers/:id',async (req, res)=>{
        const paramId = req.params.id;
        const query = {_id: ObjectId(paramId)};
        console.log('loading data from id', paramId);
        const result = await offerCollections.findOne(query);
        console.log(result);
        res.json(result);
     });


     app.get('/orders', async (req, res)=>{
       const result = orderCollections.find({});
       const orders = await result.toArray();
       console.log(orders);
       res.json(orders);
     });
     app.get('/orders/:email',async (req, res)=>{
      const paramEmail = req.params.email;
      const query = {email:paramEmail};
      console.log('loading data from id', paramEmail);
      const result = await orderCollections.find(query);
      const orders = await result.toArray();
      console.log(orders);
      res.json(orders);
   });

       //post api for offer service added
       app.post('/addOffer', async (req, res)=>{
          console.log(req.body);
          const offerInformation = req.body;
          const result = await offerCollections.insertOne(offerInformation);
          res.json(result);
       });
       app.post('/addOrder', async (req, res)=>{
        const orderInformation = req.body;
        const result = await orderCollections.insertOne(orderInformation);
        console.log(result);
        res.json(result);

     });
    }finally{
        //  await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})