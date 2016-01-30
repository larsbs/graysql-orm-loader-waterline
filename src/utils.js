'use strict';

module.exports = {
  areWaterlineModels(models) {
    for (const key in models) {
      if ( ! models[key].waterline) {
        return false;
      }
    }
    return true;
  }
};
