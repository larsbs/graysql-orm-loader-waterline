module.exports = {
  identity: 'user',
  attributes: {
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    email: {
      type: 'email',
      required: true
    },
    phone: 'string',
    group: {
      model: 'group'
    }
  }
};