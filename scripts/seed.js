import { Movie, Rating, User, db } from '../src/model.js';
import movieData from './data/movies.json' assert { type: 'json' };
import lodash from 'lodash';

console.log('syncing DB...');
await db.sync({ force: true });

console.log('Seeding database...');

console.log(movieData[0]);

const moviesInDB = await Promise.all(
  movieData.map(async (movie) => {
    // destructure what you need from each movie
    const { title, overview, posterPath } = movie;

    // create the Date in the approriate format
    // console.log(movie.releaseDate);
    // console.log(Date.parse(movie.releaseDate));
    const releaseDate = new Date(Date.parse(movie.releaseDate));
    // console.log(releaseDate);

    // create the new record in your Movie table
    const newMovie = await Movie.create({
      title: title,
      overview: overview,
      posterPath: posterPath,
      releaseDate: releaseDate,
    });

    // return the newMovie object
    return newMovie;
  })
);

const usersToCreate = [];

for (let i = 1; i <= 10; i++) {
  usersToCreate.push({
    email: `user${i}@test.com`,
    password: `test`,
  });
}

const usersInDB = await Promise.all(
  usersToCreate.map(async (user) => {
    return await User.create({ ...user });
  })
);

const ratingsInDB = await Promise.all(
  usersInDB.flatMap((user) => {
    // get ten random movies
    const randomMovies = lodash.sampleSize(moviesInDB, 10);

    // Create a rating for each movie
    const movieRatings = randomMovies.map((movie) => {
      return Rating.create({
        score: lodash.random(1, 5),
        userId: user.userId,
        movieId: movie.movieId,
      });
    });
    return movieRatings;
  })
);

await db.close();
console.log('Finished seeding database!');
