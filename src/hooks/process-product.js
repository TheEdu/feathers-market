module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const { app, data } = context;

    if(!data.uid) {
      throw new Error('A Product must have a uid');
    }

    if(!data.name) {
      throw new Error('A Product must have a name');
    }

    if(!data.description) {
      throw new Error('A Product must have a description');
    }

    if(!data.market) {
      throw new Error('A Product must have a market');
    }

    // Unique UID Validatio
    const { total } = await app.service('products').find({
        query: {
          uid: data.uid
        }
     });

    if(total > 0) {
      throw new Error('Product´s UID must be unique');
    }

     // Unique UID Validation
    const markets = await app.service('markets').find({
        query: {
          uid: data.market
        }
     });

    if(markets.total == 0 || markets.total > 1) {
      throw new Error('Market must Exists');
    }

    // The logged in user
    const { user } = context.params;

    console.log(markets.data[0]);
    console.log(user._id);

    if(markets.data[0].userId != user._id) {
      throw new Error('You must be the owner of the Marke to create a new product');
    }

    context.data = {
      uid: data.uid,
      name: data.name,
      description: data.description,
      marketId: markets.data[0]._id,
      createdAt: new Date().getTime()
    };

    return context;
  };
};
