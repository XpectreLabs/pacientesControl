const express = require('express');
const router = express();
const https = require('https');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const cors = require('cors');
require('dotenv').config();

const usersRoutes = require('./src/routes/users');
const patientsRoutes = require('./src/routes/patients');
const authRoutes = require('./src/routes/auth');

router.use(express.static('public'));
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.use(cors());

router.use('/api/v1/users', usersRoutes);
router.use('/api/v1/patients', patientsRoutes);
router.use('/api/v1/auth', authRoutes);

router.listen(3001, () => {
  console.log('Aplicación ejecutandose ....');
});


// Servidor HTTP
// const httpsServer = https.createServer(options, router);
// httpsServer.listen(443, process.env.IP);