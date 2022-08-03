'use strict';

const { server } = require('../src/server.js');
const { db } = require('../src/models/index.js');
const supertest = require('supertest');
const mockRequest = supertest(server);

beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});

describe('web server', () => {

  it('should respond with a 404 on an invalid route', () => {

    return mockRequest
      .get('/thisroutedoesnotexist')
      .then(results => {
        expect(results.status).toBe(404);
      });

  });

  // These tests are wired with async/await --- so much cleaner!
  it('should respond with a 404 on an invalid method', async () => {
    const response = await mockRequest.put('/food');
    expect(response.status).toBe(404);
  });

  it('can create a food record', async () => {
    const data = {
      name: 'carrots',
      calories: 25,
      type: 'vegetable'
    };

    const response = await mockRequest.post('/food').send(data);
    expect(response.status).toBe(200);

    //Did we get an ID?
    expect(response.body.id).toBeDefined();

    // Is the data we sent in the database?
    Object.keys(data).forEach(key => {
      expect(data[key]).toEqual(response.body[key]);
    });
  });

  it('can get list of food records', async () => {
    const response = await mockRequest.get('/food');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toEqual(1);
  });

  it('can get a food record', async () => {
    const response = await mockRequest.get('/food/1');
    expect(response.status).toBe(200);
    expect(typeof response.body).toEqual('object');
    expect(response.body.id).toEqual(1);
  });

  it('can update a food record', async () => {
    const data = { name: "Broccoli" };
    const response = await mockRequest.put('/food/1').send(data);
    expect(response.status).toBe(200);
    expect(typeof response.body).toEqual('object');
    expect(response.body.id).toEqual(1);
    expect(response.body.name).toEqual("Broccoli");
  });

  it('can delete a food record', async () => {
    const id = 1;
    // const response = await mockRequest.delete('/food/id');
    const response = await mockRequest.delete(`/food/${id}`);
    expect(response.status).toBe(200);

    const getResponse = await mockRequest.get('/food');
    expect(getResponse.body.message).toBe(`There is no food with id ${id} to delete!`);

  });

  it('can create a clothes record', async () => {
    const data = {
      name: 'shirt',
      color: 'white',
      size: 5
    };

    const response = await mockRequest.post('/clothes').send(data);
    expect(response.status).toBe(200);

    //Did we get an ID?
    expect(response.body.id).toBeDefined();

    // Is the data we sent in the database?
    Object.keys(data).forEach(key => {
      expect(data[key]).toEqual(response.body[key]);
    });
  });

  it('can get list of clothes records', async () => {
    const response = await mockRequest.get('/clothes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toEqual(1);
  });

  it('can get a record', async () => {
    const response = await mockRequest.get('/clothes/1');
    expect(response.status).toBe(200);
    expect(typeof response.body).toEqual('object');
    expect(response.body.id).toEqual(1);
  });

  it('can get a record', async () => {
    const response = await mockRequest.get('/clothes/1');
    expect(response.status).toBe(200);
    expect(typeof response.body).toEqual('object');
    expect(response.body.id).toEqual(1);
  });

  it('can update a clothes record', async () => {
    const data = { name: "jacket" };
    const response = await mockRequest.put('/clothes/1').send(data);
    expect(response.status).toBe(200);
    expect(typeof response.body).toEqual('object');
    expect(response.body.id).toEqual(1);
    expect(response.body.name).toEqual("jacket");
  });

  it('can delete a clothes record', async () => {
    const id = 1;
    // const response = await mockRequest.delete('/food/id');
    const response = await mockRequest.delete(`/clothes/${id}`);
    expect(response.status).toBe(200);

    const getResponse = await mockRequest.get(`/clothes/`);
    expect(getResponse.body.message).toBe('There are no clothes available!');

  });

});
