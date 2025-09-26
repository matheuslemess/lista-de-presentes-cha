// scripts/seed.js
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
const { listaDePresentes } = require('./lista.js');

// Inicializa o app admin do Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function cadastrarPresentes() {
  console.log('Iniciando o cadastro dos presentes. Aguarde...');

  const presentesCollection = db.collection('presentes');
  const batch = db.batch();

  listaDePresentes.forEach(nomeDoPresente => {
    const docRef = presentesCollection.doc(); // Cria uma referência com ID automático
    batch.set(docRef, {
      nome: nomeDoPresente,
      disponivel: true // Todos começam como disponíveis
    });
  });

  try {
    await batch.commit();
    console.log(`Sucesso! ${listaDePresentes.length} presentes foram cadastrados.`);
  } catch (error) {
    console.error('Erro ao cadastrar os presentes:', error);
  }
}

cadastrarPresentes();