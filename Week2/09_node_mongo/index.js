const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = 'mongodb://localhost:27017/'
const dbname = 'conFusion'
// the db name was created in Mongo REPL, 'use conFusion'
// if the db name wasn't created in REPL, it will be created in line 13, client.db()

MongoClient.connect(url, (err, client) => {
    assert.strictEqual(err, null)
    console.log('Connected correctly to server')
    
    const db = client.db(dbname)
    //the client is accessing the database name
    const collection = db.collection('dishes')

    collection.insertOne({'name':'Winter', 'description': 'Cold'}, (err, result) => {
        //insert is CREATE
        assert.strictEqual(err, null)
        console.log('After Insert: \n')
        console.log(result.ops)

        collection.find({}).toArray((err, docs) => {
            //Find is READ
            assert.strictEqual(err, null)
            console.log('Found:\n')
            console.log(docs)

            db.dropCollection('dishes', (err, result) => {
                //dropCollection is DELETE
                assert.strictEqual(err, null)
                client.close()
            })
        })
    })

})