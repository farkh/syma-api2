const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

const { connectDB } = require('./config/db');
const user = require('./routes/user.routes');
const category = require('./routes/category.routes');
const transaction = require('./routes/transaction.routes');
const requiredTransaction = require('./routes/requiredTransaction.routes');
const userSettings = require('./routes/userSettings.routes');

const app = express();
const PORT = process.env.PORT || 5000;

const cron = require('./cron');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Use routes
app.use('/api/user', user);
app.use('/api/categories', category);
app.use('/api/transactions', transaction);
app.use('/api/required/transactions', requiredTransaction);
app.use('/api/userSettings', userSettings);

const main = () => {
    connectDB();
    app.listen(PORT, () => console.log(`Server up and running at http://localhost:${PORT}`));
};

main();
