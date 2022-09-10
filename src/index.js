const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const { query } = require('express');
const db = new Database('./src/db/database.db', { verbose: console.log });
const dbUsers = new Database('./src/db/users.db', { verbose: console.log });
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
  const queryUsers = dbUsers.prepare(
    `SELECT * FROM users WHERE  email = ?  AND  password = ?`
  );
  const oneUser = queryUsers.get(req.body.email, req.body.password);

  // const oneUser = users
  //   .find((user) => user.email === req.body.email)
  //   .find((user) => user.password === req.body.password);
  if (oneUser) {
    resp.json({ success: true, userId: 'id_de_la_usuaria_encontrada' });
  } else {
    resp.json({ success: false, errorMessage: 'Usuaria/o no encontrada/o' });
  }
});

server.post('/sign-up', (req, resp) => {
  console.log('LLegan por body al sign-up', req.body);
  const queryUniqueEmail = dbUsers.prepare(
    `SELECT * FROM users WHERE email = ? `
  );
  const checkMail = queryUniqueEmail.get(req.body.email);

  if (checkMail) {
    resp.json({ success: false, errorMessage: 'Usuaria ya existente' });
  } else {
    const querySignUp = dbUsers.prepare(
      `INSERT INTO users (email, password) VALUES (?, ?)`
    );
    const result = querySignUp.run(req.body.email, req.body.password);
    console.log('Que es result', result);
    if (result) {
      resp.json({
        success: true,
        userId: `nuevo-id-añadido, el id es: ${result.lastInsertRowid} `,
      });
    } else {
      resp.json({
        success: false,
        errorMessage: 'Tienes que rellenar todos los campos',
      });
    }
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
