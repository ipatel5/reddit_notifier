const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('./db/mongoose')
const userRouter = require('./routers/user_routes');

const app = express();

app.use(cors());
app.use(express.json());
const port = 3000

app.use(userRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
module.exports = app;
