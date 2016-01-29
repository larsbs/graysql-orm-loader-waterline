module.exports = {
  identity: 'group',
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    users: {
      collection: 'user',
      via: 'group'
    }
  }
};