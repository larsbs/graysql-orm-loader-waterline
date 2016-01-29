'use strict';

const WaterlineTranslator = require('../src/waterline-translator');

describe('UNIT TEST', function(){
  describe('WaterlineTranslator', function(){
    require('./unit/waterline-translator')(WaterlineTranslator);
  });
});
