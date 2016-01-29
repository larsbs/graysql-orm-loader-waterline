'use strict';

const models = require ('../models');
const waterline = require ('waterline');
const graphql = require ('graphql');
const sailsDisk = require ('sails-disk');
const _ = require ('lodash');

let config = {
  adapters: {
    'sails-disk': sailsDisk
  },
  connections: {
    tmp: {
      adapter: 'sails-disk'
    }
  },
  defaults: {
    migrate: 'drop'
  }
};

let waterlineInstance = new waterline();
models.forEach((model) => {
  if (!model.connection) {
    model.connection = 'tmp';
  }
  waterlineInstance.loadCollection(waterline.Collection.extend(model));
});

function getWaterlineModels(cb) {
  waterlineInstance.initialize(config, (err, initializedWaterlineInstance) => {
    if (err) {
      return cb(err);
    }
    var models = initializedWaterlineInstance.collections || [];
    setupAssociations(models);
    cb(null, models);
  });
}

function setupAssociations(models) {
  _.each(models, function eachInstantiatedModel(thisModel, modelID) {

    // Bind context for models
    // (this (breaks?)allows usage with tools like `async`)
    _.bindAll(thisModel);

    // Derive information about this model's associations from its schema
    // and attach/expose the metadata as `SomeModel.associations` (an array)
    thisModel.associations = _.reduce(thisModel.attributes, function(associatedWith, attrDef, attrName) {
      if (typeof attrDef === 'object' && (attrDef.model || attrDef.collection)) {
        var assoc = {
          alias: attrName,
          type: attrDef.model ? 'model' : 'collection'
        };
        if (attrDef.model) {
          assoc.model = attrDef.model;
        }
        if (attrDef.collection) {
          assoc.collection = attrDef.collection;
        }
        if (attrDef.via) {
          assoc.via = attrDef.via;
        }

        associatedWith.push(assoc);
      }
      return associatedWith;
    }, []);
  });
}

function initializeModelsWithData(models) {
  var promise = new Promise(function(resolve, reject) {
    models.user.create({
      firstName: 'John',
      lastName: 'Johnsson',
      email: 'john@johnsson.com'
    }).then(function(createdUser) {
      // console.log(createdUser);
      return models.group.create({
        name: 'course',
        users: [createdUser.id]
      });
    }).then(function(createdGroup) {
      resolve(models);
    }).catch(function(err) {
      reject(err);
    });
  });
  return promise;
}

module.exports = {
  getWaterlineModels: getWaterlineModels,
  initializeModelsWithData: initializeModelsWithData
}