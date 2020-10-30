/* eslint-disable require-atomic-updates */
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    // Get `app`, `method`, `params` and `result` from the hook context
    const { app, method, result, params } = context;

    const addPrices= async product => {

      const prices = await app.service('prices').find({
        query: {
          productId: product._id,
          $sort: { createdAt: -1 }
        }
      });

      return {
        ...product,
        prices
      };
    };

    // In a find method we need to process the entire page
    if (method === 'find') {
      // Map all data to include the `user` information
      context.result.data = await Promise.all(result.data.map(addPrices));
    } else {
      // Otherwise just update the single result
      context.result = await addPrices(result);
    }

    return context;
  };
};