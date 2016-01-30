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

  parseModelsProperties(modelName) {
  }

  parseModelAssociations(modelName, useRelay) {
  }

  getArgsForCreate(modelName) {
  }

  getArgsForUpdate(modelName) {
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
