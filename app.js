// ANCHOR -- Imports
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import ViteExpress from 'vite-express';
import { Movie, User, Rating } from './src/model.js';

// ANCHOR -- Initializers
const app = express();
const port = '8000';
ViteExpress.config({ printViteDevServerHost: true });

// ANCHOR -- Middle-ware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

const loginRequired = (req, res, next) => {
  if (!req.session.userId) {
    res.status(401).send({ error: 'Unauthorized' });
  } else {
    next();
  }
};

// SECTION -- Routes

// ANCHOR -- get all movies
app.get('/api/movies', async (req, res) => {
  let movieData;
  try {
    // get all movies from Movies
    movieData = await Movie.findAll();
  } catch (err) {
    console.log(err);
  }

  // send response
  res.status(200).send({
    message: 'data retrieved successfully',
    data: movieData,
  });
});

// ANCHOR -- get movie by ID
app.get('/api/movies/:movieId', async (req, res) => {
  console.log('movie by id route!!');
  const movieId = req.params.movieId;
  console.log(movieId);
  let movieData;
  try {
    movieData = await Movie.findByPk(movieId);
  } catch (err) {
    console.log(err);
  }
  res.status(200).send({
    message: 'Movie retrieved successfully!',
    data: movieData,
  });
});

// ANCHOR -- post user auth
app.post('/api/auth', async (req, res) => {
  console.log('auth route');
  console.log(req.body);
  const { email, password } = req.body;
  console.log(email, password);
  let user;

  try {
    user = await User.findOne({
      where: { email: email, password: password },
    });
  } catch (err) {
    console.log(err);
  }
  console.log('found user:');
  console.log(user);

  if (user) {
    req.session.userId = user.userId;
    res.status(200).send({
      success: true,
    });
  } else {
    res.status(400).send({
      success: false,
    });
  }
});

// ANCHOR -- post logout
app.post('/api/logout', loginRequired, async (req, res) => {
  req.session.destroy();
  console.log(req.session);
  res.status(200).send({
    success: true,
  });
});

// ANCHOR -- get ratings
app.get('/api/ratings', loginRequired, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    const ratings = await user.getRatings({
      include: {
        model: Movie,
        attributes: ['title'],
      },
    });
    res.status(200).send({
      success: true,
      ratings: ratings,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post('/api/ratings', loginRequired, async (req, res) => {
  const newRating = {};
  try {
    const { movieId, score } = req.body;
    newRating = await Rating.create({
      score: score,
      movieId: movieId,
    });
  } catch (err) {
    console.log(err);
  }

  res.status(201).send({
    success: true,
    newRating: newRating,
  });
});

// !SECTION

// ANCHOR -- Server Startup
ViteExpress.listen(app, port, () => console.log(`Server is listening on http://localhost:${port}`));
