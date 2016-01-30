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
      it('should return an array containing the names of the stored models', function () {
        const expected = ['group', 'user'];
        const result = WT.getModelsNames();
        expect(result).to.deep.equal(expected);
      });
    });
    describe('#parseModelProperties(modelName)', function () {
      it('should return all the properties of the model', function () {
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
      it('should return all the associations of the model', function () {
        const expectedForGroup = {
          members: { type: '[user]' }
        };
        const expectedForUser = {
          group: { type: 'group' }
        };
        const resultForGroup = WT.parseModelAssociations('group');
        const resultForUser = WT.parseModelAssociations('user');
        expect(resultForGroup).to.deep.equal(expectedForGroup);
        expect(resultForUser).to.deep.equal(expectedForUser);
      });
      it('should return the associations as connections if useRelay is true', function () {
        const key = 'members';
        const expectedForGroup = {
          members: {
            type: '@>user',
            resolve: (model, args) => model[key]
          }
        };
        const expectedForUser = {
          group: { type: 'group' }
        };
        const resultForGroup = WT.parseModelAssociations('group', true);
        const resultForUser = WT.parseModelAssociations('user', true);
        expect(resultForGroup.members.type).to.equal(expectedForGroup.members.type);
        expect(''+resultForGroup.members.resolve).to.equal(''+expectedForGroup.members.resolve);
        expect(resultForUser).to.deep.equal(expectedForUser);
      });
    });
    describe('#getArgsForCreate(modelName)', function () {
      let resultForGroup;
      let resultForUser;
      before(function () {
        resultForGroup = WT.getArgsForCreate('group');
        resultForUser = WT.getArgsForCreate('user');
      });
      it('should return all the arguments needed to create an entity of the model', function () {
        const expectedForGroup = ['name', 'members'];
        const expectedForUser = ['nick', 'group'];
        expect(resultForGroup).to.include.keys(expectedForGroup);
        expect(resultForUser).to.include.keys(expectedForUser);
      });
      it('should return non nullable arguments as such', function () {
        const expectedForGroup = {
          name: { type: 'String!' },
          members: { type: '[Int]' }
        };
        const expectedForUser = {
          nick: { type: 'String!' },
          group: { type: 'Int' }
        };
        expect(resultForGroup).to.deep.equal(expectedForGroup);
        expect(resultForUser).to.deep.equal(expectedForUser);
      });
    });
    describe('#getArgsForUpdate(modelName)', function () {
      it('should return an object containing valid GraysQL args');
      it('should return all the arguments needed to update an entity of the model');
      it('should return non nullable arguments as such');
    });
    describe('#getArgsForDelete(modelName)', function () {
      it('should return an object containing vsalid GraysQL args');
      it('should return all the arguments needed to delete an entity of the model');
      it('should return non nullable arguments as such');
    });
    describe('#resolveById(modelName)', function () {
      it('should return a function that returns a single entity');
      it('should return a function that returns an entity of the specified model');
    });
    describe('#resolveAll(modelName)', function () {
      it('should return a function that returns multiple entities');
      it('should return a function that returns entities of the specified model');
    });
    describe('#resolveCreate(modelName)', function () {
      it('should return a function that creates a new entity of the specified model');
    });
    describe('#resolveUpdate(modelName)', function () {
      it('should return a function that updates an entity of the specified model');
    });
    describe('#resolveDelete(modelName)', function () {
      it('should return a function that deletes an entity of the specified model');
    });
    describe('#resolveNodeId(modelName)', function () {
      it('should return a function that resolves an entity of the specified model by its id');
    });
    describe('#resolveIsTypeOf(modelName)', function () {
      it('should return a function that resolves the type of the entities of the specified model');
    });
  });

};
