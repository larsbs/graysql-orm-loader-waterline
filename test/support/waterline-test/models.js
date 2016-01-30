'use strict';

const Waterline = require('waterline');


const Group = Waterline.Collection.extend({

  identity: 'group',
  connection: 'localDisk',

  attributes: {
    name: {
      type: 'String',
      required: true
    },
    members: {
      collection: 'user',
      via: 'group'
    }
  }

});


const User = Waterline.Collection.extend({

  identity: 'user',
  connection: 'localDisk',

  attributes: {
    nick: {
      type: 'String',
      required: true
    },
    group: {
      model: 'group'
    }
  }

});


module.exports = {
  Group,
  User
};
