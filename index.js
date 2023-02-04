// REQUIRE FILES
const cors = require('cors');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// CORS
const corsOptions = {
    origin: '*', 
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

// ROUTES
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const listRoute = require('./routes/list');
const movieRoute = require('./routes/movie');

// ONLINE DATABASE
const dbname = process.env.DB_NAME;
const pswd = process.env.DB_PASSWORD;
const cluster = process.env.DB_CLUSTER;
const username = process.env.DB_USERNAME;
const dbURL = `mongodb+srv://${username}:${pswd}@${cluster}.6putb.mongodb.net/${dbname}?retryWrites=true&w=majority`;
mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true,})
.then(res => console.log('DB Connected Successfully'))
.catch(err => console.log(err))

// APP USE
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/lists', listRoute);
app.use('/api/users', userRoute);
app.use('/api/movies', movieRoute);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'),
    res.header('Access-Control-Allow-Method', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'),
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, X-Requested-with, Content-Type, Accept'),
    next();
})

app.listen(process.env.PORT || 8000, () => {
    console.log('Backend Server Running');
});