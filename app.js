const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const mustache = require('mustache-express');

const app = express();
const port = process.env.PORT || 3000;
const voteRouter = require('./src/routes/voteRoute');

app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', mustache());
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'html');

app.use('/', voteRouter);
app.listen(port, () => console.log(`successfully created app at: ${chalk.green(`http://localhost:${port}`)}`));
