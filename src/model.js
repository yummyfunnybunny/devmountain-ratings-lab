import { Model, DataTypes } from "sequelize";
import util from "util";
import connectToDB from "./db.js";

export const db = await connectToDB("postgresql://postgres:postgres@localhost:5432/ratings");
// export const db = await connectToDB(
//   "host=localhost port=5432 dbname=ratings user=postgres sslmode=prefer connect_timeout=10"
// );

// USER MODEL
export class User extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

User.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "user",
    sequelize: db,
  }
);

// MOVIE MODEL
export class Movie extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

Movie.init(
  {
    movieId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      // field: "movie_id"  // this will override sequelize and force this column to be named whatever you specify here
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    overview: {
      type: DataTypes.TEXT,
    },
    releaseDate: {
      type: DataTypes.DATE,
    },
    posterPath: {
      type: DataTypes.STRING,
    },
  },
  {
    modelName: "movie",
    sequelize: db,
  }
);

// RATING MODEL
export class Rating extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

Rating.init(
  {
    ratingId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    modelName: "Rating",
    sequelize: db,
    timestamps: true, // enable timestamps
    updatedAt: false, // dont create updated_at column
  }
);

// TABLE RELATIONSHIPS
Movie.hasMany(Rating, { foreignKey: "movieId" });
Rating.belongsTo(Movie, { foreignKey: "movieId" });

User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });
