const { authenticate } = require('@feathersjs/authentication').hooks;

const processMarket = require('../../hooks/process-market');

const populateProducts = require('../../hooks/populate-products');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [processMarket()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populateProducts()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
