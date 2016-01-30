'use strict';

const WaterlineTranslator = require('../src/waterline-translator');
const Utils = require('../src/utils');

describe('UNIT TEST', function(){
  describe('WaterlineTranslator', function(){
    require('./unit/waterline-translator')(WaterlineTranslator);
    require('./unit/utils')(Utils);
  });
});
