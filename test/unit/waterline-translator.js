'use strict';

const fs = require('fs');
const path = require('path');
const rmdir = require('rmdir');
const expect = require('chai').expect;
const bootstrapWaterline = require('../support/waterline-test');


module.exports = function (WaterlineTranslator) {

  describe('@WaterlineTranslator', function () {

    let models;
    let WT;
    before(function (done) {
      bootstrapWaterline(m => {
        models = m.collections;
        WT = new WaterlineTranslator(models);
        done();
      });
    });

    after(function (done) {
      rmdir(path.resolve(__dirname, '../../.tmp'), (err, dirs, files) => {
        if (err) {
          throw new Error(err);
        }
        done();
      });
    });

    describe('#constructor(models)', function () {
      it('should only accepts an object containing waterline models', function () {
        expect(() => new WaterlineTranslator(x => x)).to.throw(TypeError, /Expected models to be a valid waterline models object/);
        expect(() => new WaterlineTranslator({})).to.throw(TypeError, /Expected models to be a valid waterline models object/);
        expect(() => new WaterlineTranslator('asdf')).to.throw(TypeError, /Expected models to be a valid waterline models object/);
        expect(() => new WaterlineTranslator(models)).to.not.throw(TypeError, /Expected models to be a valid waterline models object/);
      });
    });
    describe('#getModelsNames()', function () {
      it('should returns an array containing the names of the stored models', function () {
        const expected = ['group', 'user'];
        const result = WT.getModelsNames();
        expect(result).to.deep.equal(expected);
      });
    });
    describe('#parseModelProperties(modelName)', function () {
      it('should returns all the properties of the model', function () {
        const expectedForGroup = {
          id: { type: 'Int' },
          name: { type: 'String' },
          createdAt: { type: 'Date' },
          updatedAt: { type: 'Date' }
        };
        const expectedForUser = {
          id: { type: 'Int' },
          nick: { type: 'String' },
          createdAt: { type: 'Date' },
          updatedAt: { type: 'Date' }
        };
        const resultForGroup = WT.parseModelProperties('group');
        const resultForUser = WT.parseModelProperties('user');
        expect(resultForGroup).to.deep.equal(expectedForGroup);
        expect(resultForUser).to.deep.equal(expectedForUser);
      });
    });
    describe('#parseModelAssociations(modelName, useRelay)', function () {
      it('should returns an object containing valid GraysQL fields');
      it('should returns all the associations of the model');
      it('should not returns properties of the model');
    });
    describe('#getArgsForCreate(modelName)', function () {
      it('should returns an object containing valid GraysQL args');
      it('should returns all the arguments needed to create an entity of the model');
      it('should returns non nullable arguments as such');
    });
    describe('#getArgsForUpdate(modelName)', function () {
      it('should returns an object containing valid GraysQL args');
      it('should returns all the arguments needed to update an entity of the model');
      it('should returns non nullable arguments as such');
    });
    describe('#getArgsForDelete(modelName)', function () {
      it('should returns an object containing valid GraysQL args');
      it('should returns all the arguments needed to delete an entity of the model');
      it('should returns non nullable arguments as such');
    });
    describe('#resolveById(modelName)', function () {
      it('should returns a function that returns a single entity');
      it('should returns a function that returns an entity of the specified model');
    });
    describe('#resolveAll(modelName)', function () {
      it('should returns a function that returns multiple entities');
      it('should returns a function that returns entities of the specified model');
    });
    describe('#resolveCreate(modelName)', function () {
      it('should returns a function that creates a new entity of the specified model');
    });
    describe('#resolveUpdate(modelName)', function () {
      it('should returns a function that updates an entity of the specified model');
    });
    describe('#resolveDelete(modelName)', function () {
      it('should returns a function that deletes an entity of the specified model');
    });
    describe('#resolveNodeId(modelName)', function () {
      it('should returns a function that resolves an entity of the specified model by its id');
    });
    describe('#resolveIsTypeOf(modelName)', function () {
      it('should returns a function that resolves the type of the entities of the specified model');
    });
  });

};
