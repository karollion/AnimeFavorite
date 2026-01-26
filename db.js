const mongoose = require('mongoose');

const connectToDB = () => {
  // connects our backend code with the database
	const password = process.env.DB_PASSWORD;
	const user = process.env.DB_USER;
	const NODE_ENV = process.env.NODE_ENV;
	let dbUri = '';

	if(NODE_ENV === 'production') dbUri = ``;
	else if(NODE_ENV === 'test') dbUri = '';
	else dbUri = '';

	// connect to DB

	mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
	const db = mongoose.connection;

	// on success
	db.once('open', () => {
		console.log('Connected to the database');
	});

	// on error
	db.on('error', err => console.log('Error ' + err));
};

module.exports = connectToDB;