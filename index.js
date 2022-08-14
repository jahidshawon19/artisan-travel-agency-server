const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const app = express() 
const port = process.env.PORT || 5000; 


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qypzm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
      await client.connect();
      const database = client.db('artisan-trip')
      const tourPackageCollection = database.collection('tourPacakge')
      const orderTourCollection = database.collection('orderTour')

      //POST API FOR ADDING TOUR PACKAGE
      app.post('/tourPackage', async (req, res)=>{

          const newTourPackage = req.body 
          const result = await tourPackageCollection.insertOne(newTourPackage)
          res.json(result)
      })


    //GET API FOR LOADING ALL TOUR PACKAGE

      app.get('/tourPackages', async (req, res)=>{
            const cursor = tourPackageCollection.find({})
            const allTourPackages = await cursor.toArray();
            res.send(allTourPackages)
      })


      //GET API FOR LOADING SINGLE TOUR PACKAGE

      app.get('/tourPackages/:id', async (req, res) =>{

        const id = req.params.id; 
        const query = { _id: ObjectId(id)}
        const signleTourPackage = await tourPackageCollection.findOne(query) 
        res.json(signleTourPackage) 

       })

       
       // DELETE API FOR DELETE TOUR PACKAGE 
       app.delete('/tourPackages/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await tourPackageCollection.deleteOne(query)
        res.json(result)
     })


     // PUT API FOR UPDATE TOUR PACKAGE

      app.put('/tourPackages/:id', async (req, res)=>{
        const id = req.params.id;
        const updatedPackage = req.body 
        const filter = { _id: ObjectId(id)}
        const options = {upsert:true}
        const updateDoc = {
          $set:{
            packageName:updatedPackage.packageName,
            packageDuration: updatedPackage.packageDuration,
            price:updatedPackage.price,
            photo:updatedPackage.photo,
            details:updatedPackage.details
          }
        }

        const result = await tourPackageCollection.updateOne(filter, updateDoc, options)
        res.json(result)
      })


     


      //POST API FOR ADDING ORDER 
       app.post('/orderTour', async (req, res)=>{
        const newTourOrder = req.body 
        const result = await orderTourCollection.insertOne(newTourOrder)
        res.json(result)
       })


      //GET API FOR LOADING ALL ORDER

      app.get('/orderTours', async (req, res)=>{
        const cursor = orderTourCollection.find({})
        const allOrders = await cursor.toArray();
        res.send(allOrders)
     })
 
      //GET API FOR LOADING SINGLE ORDER DETAILS

      app.get('/orderTours/:id', async (req, res) =>{

        const id = req.params.id; 
        const query = { _id: ObjectId(id)}
        const signleOrder = await orderTourCollection.findOne(query) 
        res.json(signleOrder) 

       })


       // DELETE API FOR DELETE ORDER
       app.delete('/orderTours/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await orderTourCollection.deleteOne(query)
        res.json(result)
     })       



     // GET API FOR SPECIFIC USER'S ORDER 
     app.get('/myorders', async (req, res)=>{
        let query = {}
        const email = req.query.email 
        if(email){
          query = {TouristEmail:email}
        }
        const cursor = orderTourCollection.find(query)
        const orders = await cursor.toArray()
        res.json(orders)
     })
      

    } finally {
        // await client.close();
    }
  }
  run().catch(console.dir);



app.get('/', (req, res)=>{

    res.send('Artisan Trip server running ...')
})  

app.listen(port, ()=>{
    console.log(`Server running at ${port}`)
})


