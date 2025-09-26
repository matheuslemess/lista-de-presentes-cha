// scripts/reseed.js
const admin = require('firebase-admin');
const { listaDePresentes } = require('./lista.js');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function reseedPresentes() {
  console.log('Apagando presentes antigos...');

  const presentesSnapshot = await db.collection('presentes').get();
  const batchDelete = db.batch();

  presentesSnapshot.forEach(doc => {
    batchDelete.delete(doc.ref);
  });

  await batchDelete.commit();
  console.log('Presentes antigos apagados!');

  console.log('Cadastrando novos presentes...');
  const batchAdd = db.batch();
  const presentesCollection = db.collection('presentes');

  listaDePresentes.forEach(nomeDoPresente => {
    const docRef = presentesCollection.doc();
    batchAdd.set(docRef, { nome: nomeDoPresente, disponivel: true });
  });

  await batchAdd.commit();
  console.log(`Sucesso! ${listaDePresentes.length} presentes cadastrados.`);
}

reseedPresentes();
