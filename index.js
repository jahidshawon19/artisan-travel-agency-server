const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const app = express() 
const SSLCommerzPayment = require('sslcommerz')
const port = process.env.PORT || 5000; 


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

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

    res.send('<h1>Artisan Trip server running ...</h1>')
})  





// ########################  PAYMENT INITIALIZATION START ##################### //


app.post('/init', (req, res) => {
 
  const data = {
      total_amount: req.body.total_amount,
      currency: 'BDT',
      tran_id: 'REF123',
      success_url: 'http://localhost:5000/success',
      fail_url: 'http://localhost:5000/fail',
      cancel_url: 'http://localhost:5000/cancel',
      ipn_url: 'http://localhost:5000/ipn',
      shipping_method: 'Courier',
      product_name: req.body.product_name,
      product_category: 'Electronic',
      product_profile: 'general',
      cus_name: req.body.cus_name,
      cus_email: req.body.cus_email,
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: '01711111111',
      cus_fax: '01711111111',
      ship_name: 'Customer Name',
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
      multi_card_name: 'mastercard',
      value_a: 'ref001_A',
      value_b: 'ref002_B',
      value_c: 'ref003_C',
      value_d: 'ref004_D'
  };

  const sslcommer = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD,false) //true for live default false for sandbox
  sslcommer.init(data).then(data => {
      //process the response that got from sslcommerz 
      //https://developer.sslcommerz.com/doc/v4/#returned-parameters
   
     
      if(data.GatewayPageURL){
        res.json(data.GatewayPageURL)
      }else{
        return res.status(400).json({
          message:'Payment Session Failed'
        })
      }
  });


})


app.post('/success', async(req, res) =>{
 
  res.status(200).redirect('http://localhost:3000/success')
})

app.post('/fail', async (req, res) =>{
  res.status(200).redirect('http://localhost:3000')
})


app.post('/cancel', async (req, res) =>{
  res.status(200).redirect('http://localhost:3000')
})



// ########################  PAYMENT INITIALIZATION END ##################### //




app.listen(port, ()=>{
    console.log(`Server running at ${port}`)
})


