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

app.post('/create',async (req,res) => {
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
        const response = db.collection("expedientes").doc(id).set(documentoJson);
        res.send(response);
        console.log(response);
    } catch(error){
        console.log(error);
        res.send(`Evento no esperado ....${error}`);
    }
})



const PORT =  process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})




