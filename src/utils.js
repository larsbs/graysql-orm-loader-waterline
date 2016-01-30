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
  },
  parseTypeToGraysQLType(type) {
    switch (type) {
        case 'integer':
          return 'Int';
        case 'string':
          return 'String';
        case 'datetime':
          return 'Date';
        default:
          throw new Error(`Unsupported type ${type}`);
    }
  }
};
