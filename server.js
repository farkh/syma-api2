const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

const { connectDB } = require('./config/db');
const user = require('./routes/user.routes');
const category = require('./routes/category.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Use routes
app.use('/api/user', user);
app.use('/api/categories', category);

const main = () => {
    connectDB();
    app.listen(PORT, () => console.log(`Server up and running at http://localhost:${PORT}`));
};

main();
