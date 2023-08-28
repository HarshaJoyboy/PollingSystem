const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./routes/handler.js');
//const pool = require('./config/db.js');
require('dotenv/config');

const app = express();
const cors = require("cors");
app.use(cors({ origin: ["http://localhost:3000" ]}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', routesHandler);

const PORT = process.env.PORT || 4000; // backend routing port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
