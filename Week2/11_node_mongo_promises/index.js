const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const dboper = require('./operations')

const url = 'mongodb://localhost:27017/'
const dbname = 'conFusion'
// the db name was created in Mongo REPL, 'use conFusion'
// if the db name wasn't created in REPL, it will be created in line 13, client.db()

MongoClient.connect(url).then( (client) => {
    console.log('Connected correctly to server')
    const db = client.db(dbname)

    dboper.insertDocument(db, {name: 'Summer', description: 'Hot'}, 'dishes')
    .then((result) => {
        console.log(`Insert: \n`, result.ops)
        return dboper.findDocuments(db, 'dishes')
    })
    .then((docs) => {
        console.log(`Found Documents: \n`, docs)
        return dboper.updateDocument(db, {name: 'Summer'}, {description: 'Updated Very Hot'}, 'dishes')
    })
    .then((result)=> {
        console.log(`Updated Document: \n`, result.result)
        return dboper.findDocuments(db, 'dishes')
    })       
    .then((docs) => {
        console.log(`Found Documents: \n`, docs)
        return db.dropCollection('dishes') 
     })
     .then((result) => {
        console.log(`Dropped Collection: `, result)
        return client.close()
    })

})
.catch((err) => console.log(err))