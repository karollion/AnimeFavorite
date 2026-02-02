const mongoose = require('mongoose');

const connectToDB = async () => {
	const uri = process.env.NODE_ENV === 'production'
		? process.env.MONGO_URI_PROD
		: process.env.MONGO_URI_DEV

	try {
		if (!uri) {
		throw new Error('❌ MONGO_URI is not defined in .env')
		}

		await mongoose.connect(uri)

		console.log('✅ MongoDB connected')
	} catch (err) {
		console.error('❌ MongoDB connection error:', err.message)
		process.exit(1)
	}
}

module.exports = connectToDB;