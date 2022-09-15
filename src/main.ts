import express from 'express';

const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello from Express!').status(200);
});

app.listen(5000, () => console.log('Listening on port 5000'));
