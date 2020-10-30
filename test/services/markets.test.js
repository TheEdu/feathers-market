const assert = require('assert');
const app = require('../../src/app');

describe('\'markets\' service', () => {
  it('registered the service', () => {
    const service = app.service('markets');

    assert.ok(service, 'Registered the service');
  });
});
