'use strict';


function isManyRelation(relation) {
  return !!relation.attribute.collection;
}


function createRelationPromise(id, relation, models) {
  if (isManyRelation(relation)) {
    const via = relation.attribute.via;
    return models[relation.attribute.collection].find({ [via]: id });
  }
  else {
    return models[relation.attribute.model].findOneById(id);
  }
}


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
  populateAll(context) {
    // Necessary because populateAll from waterline is broken outside of sails
    for (const key in context._context.attributes) {
      if (Utils.isAssociation(context._context.attributes[key])) {
        context.populate(key);
      }
    }
    return context;
  },
  makeCircular(context, models) {
    const relations = [];
    for (const key in context._context.attributes) {
      if (Utils.isAssociation(context._context.attributes[key])) {
        relations.push({
          key,
          attribute: context._context.attributes[key]
        });
      }
    }
    return context.then(result => {
      result = result.toObject();
      for (const relation of relations) {
        result[relation.key] = createRelationPromise(result.id, relation, models);
      }
      return result;
    });
  }
};
