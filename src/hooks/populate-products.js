/* eslint-disable require-atomic-updates */
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    // Get `app`, `method`, `params` and `result` from the hook context
    const { app, method, result, params } = context;

    const addProducts= async market => {
      // Get the user based on their id, pass the `params` along so
      // that we get a safe version of the user data
      const products = await app.service('products').find({
        query: {
          marketId: market._id,
          $sort: { createdAt: -1 }
        }
      });

      // Merge the message content to include the `user` object
      return {
        ...market,
        products
      };
    };

    // In a find method we need to process the entire page
    if (method === 'find') {
      // Map all data to include the `user` information
      context.result.data = await Promise.all(result.data.map(addProducts));
    } else {
      // Otherwise just update the single result
      context.result = await addProducts(result);
    }

    return context;
  };
};