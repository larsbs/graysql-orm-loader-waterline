'use strict';

module.exports = {
  areWaterlineModels(models) {
    if (typeof models !== 'object' || Array.isArray(models)) {
      return false;
    }

    if (Object.keys(models).length < 1) {
      return false;
    }

    for (const key in models) {
      if ( ! models[key].waterline) {
        return false;
      }
    }

    return true;
  }
};
