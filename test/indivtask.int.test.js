const request = require('supertest');
const utils = require('./utils')

const app = utils.app
const db = utils.db

const name = "test";
const username = "test@test.com";
const password = "testword";

beforeAll(async () => {
  await utils.before();
});


afterAll(async () => {
  await utils.after();
});
