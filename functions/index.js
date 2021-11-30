const serviceAccount = require("./permission.json");
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://keautofill-0001-default-rtdb.asia-southeast1.firebasedatabase.app/",
});
// eslint-disable-next-line no-unused-vars
const db = admin.firestore();
const functions = require("firebase-functions");
// eslint-disable-next-line no-unused-vars
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: true }));

app.get("/hello-world", (req, res) => {
  return res.status(200).send("Hello World!");
});

// create
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db
        .collection("items")
        .doc("/" + req.body.id + "/")
        .create({ item: req.body.item });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    } 
  })();
});

app.get('/api/read/:item_id', (req, res) => {
  (async () => {
      try {
          const document = db.collection('items').doc(req.params.item_id);
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
app.get('/api/read', (req, res) => {
  (async () => {
      try {
          let query = db.collection('items');
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
app.put('/api/update/:item_id', (req, res) => {
(async () => {
  try {
      const document = db.collection('items').doc(req.params.item_id);
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
app.delete('/api/delete/:item_id', (req, res) => {
(async () => {
  try {
      const document = db.collection('items').doc(req.params.item_id);
      await document.delete();
      return res.status(200).send();
  } catch (error) {
      console.log(error);
      return res.status(500).send(error);
  }
  })();
});

exports.app = functions.https.onRequest(app);
