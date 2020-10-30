module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const { app, data } = context;

    if(!data.uid) {
      throw new Error('A Market must have a uid');
    }

    if(!data.name) {
      throw new Error('A Market must have a name');
    }

    if(!data.description) {
      throw new Error('A Market must have a description');
    }

    const { total } = await app.service('markets').find({
        query: {
          uid: data.uid
        }
     });

    if(total > 0) {
      throw new Error('Market´s UID must be unique');
    }

    // The logged in user
    const { user } = context.params;

    context.data = {
      uid: data.uid,
      name: data.name,
      description: data.description,
      userId: user._id,
      createdAt: new Date().getTime()
    };

    return context;
  };
};
