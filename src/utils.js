'use strict';


function isManyRelation(relation) {
  return !!relation.attribute.collection;
}


function createRelationPromise(source, relation, models) {
  if (isManyRelation(relation)) {
    const via = relation.attribute.via;
    return Utils.makeCircular(models[relation.attribute.collection].find({ [via]: source.id }), models);
  }
  else {
    const relationId = source[relation.attribute.model];
    return Utils.makeCircular(models[relation.attribute.model].findOneById(relationId), models);
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
  getArgs(attributes, ignoreKeys, ignoreRequired) {
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
          args[key].type = (attribute.required && ! ignoreRequired || key === 'id') ? args[key].type + '!' : args[key].type;
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
      if ( ! result) {
        return result;
      }

      if (Array.isArray(result)) {
        result = result.map(x => x.toObject())
        .map(e => {
          const result = Object.assign({}, e);
          for (const relation of relations) {
            if (typeof result[relation.key] !== 'function') {
              result[relation.key] = () => createRelationPromise(e, relation, models);
            }
          }
          result._model = context._context._model;
          return result;
        });
      }
      else {
        result = result.toObject();
        const cloned = Object.assign({}, result);
        for (const relation of relations) {
          if (typeof result[relation.key] !== 'function') {
            result[relation.key] = () => createRelationPromise(cloned, relation, models);
          }
        }
        result._model = context._context._model;
      }

      return result;
    });
  }
};
