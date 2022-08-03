'use strict';

require('dotenv').config();

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory:' : process.env.DATABASE_URL;

const { Sequelize, DataTypes } = require('sequelize');

const Collection = require('./data-collection.js');
const foodSchema = require('./food/model.js');
const clothesSchema = require('./clothes/model.js');
const recipeSchema = require('./recipe/model.js');
const foodRecipeSchema = require('./foodRecipe/model.js');
const userSchema = require('./users/model.js');

const sequelizeOptions = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
} : {};

// turn schemas into Sequelize models
// each model takes in the sequelize and DataTypes params
const sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);
const FoodModel = foodSchema(sequelize, DataTypes);
const ClothesModel = clothesSchema(sequelize, DataTypes);
const RecipeModel = recipeSchema(sequelize, DataTypes);
const FoodRecipeModel = foodRecipeSchema(sequelize, DataTypes);
const UserModel = userSchema(sequelize, DataTypes);

// Now we pass in our Model into our Collection class
// create our Collections and associations
const FoodCollection = new Collection(FoodModel);
const ClothesCollection = new Collection(ClothesModel);
const RecipeCollection = new Collection(RecipeModel);
FoodCollection.belongsToManyThrough(RecipeCollection, FoodRecipeModel);
RecipeCollection.belongsToManyThrough(FoodCollection, FoodRecipeModel);
const UsersCollection = new Collection(UserModel);

// we're exporting the left variable of the module.exports
// This is sort like an alias- we could just export the FoodCollection directly
module.exports = {
  db: sequelize,
  Food: FoodCollection,
  Clothes: ClothesCollection,
  Recipe: RecipeCollection,
  Users: UsersCollection,
};
