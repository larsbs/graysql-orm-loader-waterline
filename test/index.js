'use strict';


describe('UNIT TESTS', function() {
  describe('WaterlineTranslator', function(){
    require('./unit/waterline-translator');
    require('./unit/utils');
  });
});

describe('INTEGRATION TESTS', function () {
  require('./integration');
});
