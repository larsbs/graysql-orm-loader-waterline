'use strict';

const WaterlineTranslator = require('../src/waterline-translator');
const Utils = require('../src/utils');

describe('UNIT TESTS', function() {
  describe('WaterlineTranslator', function(){
    require('./unit/waterline-translator')(WaterlineTranslator);
    require('./unit/utils')(Utils);
  });
});

describe('INTEGRATION TESTS', function () {
  require('./integration')();
});
