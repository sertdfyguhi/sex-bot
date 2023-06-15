import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('get sexed');
});

export default function keepalive(client) {
  client.login(process.env.TOKEN);
  app.listen(3000);
}
