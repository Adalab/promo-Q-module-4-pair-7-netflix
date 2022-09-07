const express = require('express');
const cors = require('cors');
const movieData = require('./data/movies.json');
const users = require('./data/users.json');
// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// template engines
server.set('view engine', 'ejs');

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});
server.get('/movies', (req, resp) => {
  console.log(req.query.gender);
  const genderFilterParam = movieData.filter((movie) => {
    if (req.query.gender === '') {
      return true;
    } else {
      return movie.gender === req.query.gender;
    }
  });
  const response = {
    success: true,
    movies: genderFilterParam,
  };
  resp.json(response);
});

server.post('/login', (req, resp) => {
  console.log(req.body);
  const oneUser = users
    .find((user) => user.email === req.body.email)
    .find((user) => user.password === req.body.password);
  if (oneUser) {
    resp.json({ success: true, userId: 'id_de_la_usuaria_encontrada' });
  } else {
    resp.json({ success: false, errorMessage: 'Usuaria/o no encontrada/o' });
  }
});

server.get('/movie/:movieId', (req, res) => {
  const foundMovie = movieData.find(
    (oneMovie) => oneMovie.id === req.params.movieId
  );
  console.log(foundMovie);
  res.render('movie', foundMovie);
});

// static servers
const staticServer = './src/public-react';
server.use(express.static(staticServer));

const staticServerImages = './src/public-movies-images';
server.use(express.static(staticServerImages));

const staticServerStyles = './src/public-css';
server.use(express.static(staticServerStyles));
