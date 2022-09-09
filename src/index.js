const express = require('express');
const cors = require('cors');
const users = require('./data/users.json');
const Database = require('better-sqlite3');
const { query } = require('express');
const db = new Database('./src/db/database.db', { verbose: console.log });
// create and config server
const server = express();
server.use(cors());
server.use(
  express.json({
    limit: '25mb',
  })
);

// template engines
server.set('view engine', 'ejs');

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

server.get('/movies', (req, resp) => {
  // console.log('consoleando', response);
  console.log('Ver las query params', req.query.gender);
  let response = [];
  if (req.query.gender === '') {
    const query = db.prepare(`SELECT * FROM movies ORDER BY title DESC`);
    response = query.all();
  } else {
    const query = db.prepare(
      `SELECT *FROM movies  WHERE gender =? ORDER BY title DESC`
    );
    response = query.all(req.query.gender);
  }
  // const genderFilterParam = movieData.filter((movie) => {
  //   if (req.query.gender === '') {
  //     return true;
  //   } else {
  //     return movie.gender === req.query.gender;
  //   }
  // });
  // const response = {
  //   success: true,
  //   movies: genderFilterParam,
  // };
  resp.json({
    success: true,
    movies: response,
  });
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
  const query = db.prepare(`SELECT * FROM movies WHERE id = ?`);
  const movieId = query.get(req.params.movieId);
  //const foundMovie = movieData.find(
  //(oneMovie) => oneMovie.id === req.params.movieId
  //);
  //console.log(foundMovie);
  res.render('movie', movieId);
});

// static servers
const staticServer = './src/public-react';
server.use(express.static(staticServer));

const staticServerImages = './src/public-movies-images';
server.use(express.static(staticServerImages));

const staticServerStyles = './src/public-css';
server.use(express.static(staticServerStyles));
