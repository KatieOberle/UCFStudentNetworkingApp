const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();
const url = process.env.MONGODB_URI;

const client = new MongoClient(url);
client.connect();

const authController = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');

const profileController = require('./controllers/profileController');
const profileRoutes = require('./routes/profileRoutes');

authController.setDatabase(client);
profileController.setDatabase(client);

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.use((req, res, next) =>
	{
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader(
			'Access-Controll-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		);
		res.setHeader(
			'Access-Control-Allow-Methods',
			'GET, POST, PATCH, DELETE, OPTIONS'
		);
		next();
	});

app.listen(5000); // start Node + Express server on port 5000


