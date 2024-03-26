const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

function findAll() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                reject(err);
                return;
            }
            const db = client.db("mydb");
            const collection = db.collection('customers');
            const cursor = collection.find({}).limit(10);
            cursor.toArray((err, docs) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(docs);
                client.close();
            });
        });
    });
}

setTimeout(() => {
    findAll()
        .then(docs => {
            console.log(docs);
        })
        .catch(err => {
            console.error(err);
        });
    console.log('iter');
}, 5000);
