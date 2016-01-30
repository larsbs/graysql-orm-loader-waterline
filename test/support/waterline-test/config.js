'use strict';

const diskAdapter = require('sails-disk');


module.exports = {

  adapters: {
    disk: diskAdapter
  },

  connections: {
    localDisk: {
      adapter: 'disk'
    }
  }

};
