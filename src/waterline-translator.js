'use strict';

const Utils = require('./utils');


class WaterlineTranslator {

  constructor(models) {
    if ( ! models || ! Utils.areWaterlineModels(models)) {
      throw new TypeError(`Expected models to be a valid waterline models object, got ${typeof models} instead`);
    }

    this._models = models;
  }

  getModelsNames() {
    return Object.keys(this._models);
  }

  parseModelProperties(modelName) {
    const model = this._models[modelName];
    const properties = {};

    for (const key in model.attributes) {
      if ( ! Utils.isAssociation(model.attributes[key])) {
        properties[key] = { type: Utils.parseTypeToGraysQLType(model.attributes[key].type) };
      }
    }

    return properties;
  }

  parseModelAssociations(modelName, useRelay) {
    const model = this._models[modelName];
    const associations = {};

    for (const key in model.attributes) {
      if (Utils.isAssociation(model.attributes[key])) {
        const association = model.attributes[key];
        if (association.model) {
          associations[key] = { type: association.model };
        }
        else if (association.collection) {
          if (useRelay) {
            associations[key] = {
              type: `@>${association.collection}`,
              resolve: (model, args) => model[key]
            };
          }
          else {
            associations[key] = { type: `[${association.collection}]` };
          }
        }
      }
    }

    return associations;
  }

  getArgsForCreate(modelName) {
    const model = this._models[modelName];
    const ignoreKeys = ['id', 'createdAt', 'updatedAt'];
    return Utils.getArgs(model.attributes, ignoreKeys);
  }

  getArgsForUpdate(modelName) {
    const model = this._models[modelName];
    const ignoreKeys = ['createdAt', 'updatedAt'];
    return Utils.getArgs(model.attributes, ignoreKeys);
  }

  getArgsForDelete(modelName) {
  }

  resolveById(modelName) {
  }

  resolveAll(modelName) {
  }

  resolveCreate(modelName) {
  }

  resolveUpdate(modelName) {
  }

  resolveDelete(modelName) {
  }

  resolveNodeId(modelName) {
  }

  resolveNodeId(modelName) {
  }

  resolveIsTypeOf(modelName) {
  }

}

module.exports = WaterlineTranslator;
