module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const { app, data } = context;
    const { user } = context.params;

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

    if(!data.purchase_price) {
      throw new Error('A Price must have a purchase_price');
    }

    if(!data.sale_price) {
      throw new Error('A Price must have a sale_price');
    }

    if(!data.wholesale_price) {
      throw new Error('A Price must have a wholesale_price');
    }

    // Unique UID Validatio
    const { total } = await app.service('products').find({
        query: {
          uid: data.uid
        }
     });

    if(total > 0) {
      throw new Error('Product´s UID must be Unique');
    }

     // Market must  exist
    const markets = await app.service('markets').find({
        query: {
          uid: data.market
        }
     });

    if(markets.total == 0 || markets.total > 1) {
      throw new Error('Market must  Exist');
    }

    // Market owner
    if(markets.data[0].userId != user._id) {
      throw new Error('You must be the owner of the Market to create a new product');
    }

    context.data = {
      uid: data.uid,
      name: data.name,
      description: data.description,
      sale_price: data.sale_price,
      purchase_price: data.purchase_price,
      wholesale_price: data.wholesale_price,
      marketId: markets.data[0]._id,
      createdAt: new Date().getTime()
    };

    return context;
  };
};
