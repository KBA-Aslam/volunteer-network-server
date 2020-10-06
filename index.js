const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const {ObjectId} = require('mongodb')


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hqma3.mongodb.net/volunteerNetwork?retryWrites=true&w=majority`;

const app = express()
const port = 4200

app.use(bodyParser.json());
app.use(cors());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("volunteerNetwork").collection("services");
  const registryCollection = client.db("volunteerNetwork").collection("registers");
  


    app.post('/addService', (req, res) => {
        const service = req.body;
        console.log(service)
        serviceCollection.insertMany(service)
        .then(result => {
            // console.log(result);
            res.send(result.insertedCount)
        })
    
    })
    
    app.get('/services', (req, res) => {
        serviceCollection.find({})
        .toArray( (err, documents) =>{
        res.send(documents)
        })
    });

    app.post('/registry', (req, res) => {
      const registry = req.body;
      registryCollection.insertOne(registry)
      .then(result => {
          res.send(result.insertedCount > 0)
          console.log(result)
      })
    })

    app.get('/review', (req, res) => {
      serviceCollection.find({email: req.query.email})
      .toArray((err, documents)=> {
        res.send(documents)
    })
  })

    app.delete(`/delete/:id`, (req, res) => {
      console.log(req.params.id)
      registryCollection.deleteOne({ _id: ObjectId(req.params.id) })
        .then(result => {
          res.send(result)
        })
    })

    app.get('/students', (req, res) => {
      registryCollection.find({})
        .toArray((err, documents) => {
          res.send(documents);
        })
    })

    app.post('/event', (req, res) => {
      const newEvent = req.body
      serviceCollection.insertOne(newEvent)
        .then(result => {
          if (result.insertedCount > 0) {
            res.send(result)
          }
        })
      })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)