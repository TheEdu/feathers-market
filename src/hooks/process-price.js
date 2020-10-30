module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const { app, data } = context;
    const { user } = context.params;

    if(!data.product) {
      throw new Error('A Price must have a product');
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

    // Product Must Exists and be Unique
    const products = await app.service('products').find({
        query: {
          uid: data.product
        }
     });

    if(products.total == 0 || products.total > 1) {
      throw new Error('Product must Exist');
    }

	// Market must Exist
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
      throw new Error('You must be the owner of the Market.');
    }


    context.data = {
    	sale_price: data.sale_price,
    	purchase_price: data.purchase_price,
      	wholesale_price: data.wholesale_price,
      	productId: products.data[0]._id,
      	createdAt: new Date().getTime()
    };

    return context;
  };
};