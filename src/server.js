'use strict';

// 3rd Party Dependencies (modules)
const express = require('express');

// Our own custom modules
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');
const authRoutes = require('./middleware/auth/route.js');

const foodRoutes = require('./routes/food.js');
const clothesRoutes = require('./routes/clothes.js');
const userRoutes = require('./routes/user.js');

// STRETCH GOAL
// const v1Routes = require('./routes/v1.js');

const app = express();

// Express Global Middleware
// this allow us to access json data form the req.body;
app.use(express.json());

// Using our own Global Middleware - every route has access to these
app.use(logger);

// Use our routes from the routing module.
// wwe could preface each these routes with app.use('/api/food/', foodRoutes);
app.use(foodRoutes);
app.use(clothesRoutes);
app.use(authRoutes);
app.use(userRoutes);

// STRETCH GOAL
// app.use('/api/v1', v1Routes);

// Our Error Handlers -- need to be the last things defined!
// These use the external modules we required above
app.use('*', notFoundHandler);
app.use(errorHandler);

// Export an object with the express app and separate method that can start the server
module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error("Missing Port"); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
