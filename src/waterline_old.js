//'use strict';

//const _ = require('lodash');
//const capitalize = require('lodash.capitalize');


//function waterlineTypesToGQLType(attribute) {
  //switch (attribute) {
    //case 'string':
      //return 'String';
    //case 'integer':
      //return 'Int';
    //case 'float':
      //return 'Float';
    //default:
      //return 'String';
  //}
//}

//function isWaterlineModels(models) {
  //if (Object.keys(models).length < 1) {
    //return false;
  //}

  //for (const key in models) {
    //if ( ! models[key].waterline) {
      //return false;
    //}
  //}
  //return true;
//}


//class WaterlineTranslator{
  //constructor(models) {
    //if (typeof models !== 'object' || ! isWaterlineModels(models)) {
      //throw new TypeError('Has to be an object');
    //}
    //this._models = models;
  //}

  //getModels() {
    //return Object.keys(this._models);
  //}

  //getModelById(model, id) {
    //return this._models[model].find({
      //id: id
    //}).then(function(result) {
      //return result;
    //});
  //}

  //getModelByCriteria(model, args) {
    //return this._models[model].find({ args }.populateAll().then(function(results) {
      //return results;
    //}));
  //}

  //createModel(model, args) {
    //return this._models[model].create;
  //}

  //updateModel(model, args) {
    //return this._models[model].update;
  //}

  //deleteModel(model, args) {
    //return this._models[model].delete;
  //}

  //getAttributesFrom(model) { //'accessToken': 'String'
    //const attributes = {};
    //_.mapKeys(this._models[model].attributes, function(attribute, key) {
      //if (attribute.type) {
        //attribute[key] = waterlineTypesToGQLType(attribute.type);
      //}
    //});

    //return attributes;
  //}

  //getAssociationsFrom(model) { //'user': '[User]'
    //const associations = {};
    //this._models[model].associations.forEach((association) => {
      //if (association.type === 'model') {
        //associations[association.alias] = '\'' + _.capitalize(association.alias) + '\'';
      //} else if (association.type === 'collection') {
        //associations[association.alias] = '\'[' + _.capitalize(association.alias) + ']\'';
      //}
    //});

    //return associations;
  //}
//}

//module.exports = WaterlineTranslator;
