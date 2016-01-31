'use strict';

let Utils;
module.exports = Utils = {
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
  isAssociation(attribute) {
    return !!attribute.model || !!attribute.collection;
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
  },
  getArgs(attributes, ignoreKeys) {
    const args = {};
    for (const key in attributes) {
      if (ignoreKeys.indexOf(key) < 0) {
        const attribute = attributes[key];
        if (Utils.isAssociation(attribute)) {
          if (attribute.collection) {
            args[key] = { type: '[Int]' };
          }
          else {
            args[key] = { type: 'Int' };
          }
        }
        else {
          args[key] = { type: Utils.parseTypeToGraysQLType(attribute.type) };
          args[key].type = (attribute.required || key === 'id') ? args[key].type + '!' : args[key].type;
        }
      }
    }
    return args;
  },
  makeCircular(entity, models) {
  }
};
