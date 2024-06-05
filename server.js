const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser'); 

const app = express();

app.use(bodyParser.json({ limit: '1000kb' })); 

app.use(cors());

const admin = require("firebase-admin");
const credentials = require("./key.json");

admin.initializeApp({
    credential : admin.credential.cert(credentials)
});

app.use(express.json());

app.use(express.urlencoded({extended : true}));

const db = admin.firestore();

app.post('/api/createTemplate',async (req,res) => {
    try {
        
        console.log(req.body);
        const id = req.body.idDoc;
        const documentoJson = {
            idDoc : req.body.idDoc,
            xmlDoc : req.body.xmlDoc,
            templateName : req.body.templateName
        };

        console.log(documentoJson);
        console.log(id);
        const response = db.collection("templates").doc(id).set(documentoJson);
        res.send(response);
        console.log(response);
    } catch(error){
        console.log(error);
        res.send(`Evento no esperado ....${error}`);
    }
})

// read item
app.get('/api/readTemplate/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('templates').doc(req.params.id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });


    // read all
app.get('/api/readAllTemplates', (req, res) => {
    (async () => {
        try {
            let query = db.collection('templates');
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    id: doc.id,
                    item: doc.data().item
                };
                response.push(selectedItem);
            }
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });
    
    // update
app.put('/api/updateTemplate/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('templates').doc(req.params.id);
            await document.update({
                item: req.body.item
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });


    // delete
app.delete('/api/deleteTemplate/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('templates').doc(req.params.id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

const PORT =  process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})




