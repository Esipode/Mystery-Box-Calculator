require('newrelic');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
})

const statsRouter = require('./routes/stats');

app.use('/stats', statsRouter);

//Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
	//set static folder
	app.use(express.static('build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'build/index.html'));
	});
}

app.listen(port, () => {{
	console.log(`Server is running on port: ${port}`)
}});