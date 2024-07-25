const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/proxy', (req, res) => {
  const url = 'https://webhook.site/token/c689e74d-24c4-457b-b80f-dd87d09c56e5/request/latest/raw';

  request(url, (error, response, body) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(response.statusCode).send(body);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
