const { authenticate } = require('@feathersjs/authentication').hooks;

const processProduct = require('../../hooks/process-product');

const populatePrices = require('../../hooks/populate-prices');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [processProduct()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [/*populatePrices()*/],
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
