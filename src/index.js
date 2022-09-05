const express = require('express');
const cors = require('cors');
const movieData = require('./data/movies.json');
// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});
server.get('/movies', (req, resp) => {
  console.log(req.query);
  // resp.json(movieData);
  const genderFilterParam = movieData.filter(
    (movie) => movie.gender === req.query.gender
  );
  resp.json(genderFilterParam);
});
