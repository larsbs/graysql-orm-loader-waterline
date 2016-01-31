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
      let resultForGroup;
      let resultForUser;
      before(function () {
        resultForGroup = WT.getArgsForUpdate('group');
        resultForUser = WT.getArgsForUpdate('user');
      });
      it('should return all the arguments needed to update an entity of the model', function () {
        const expectedForGroup = ['id', 'name', 'members'];
        const expectedForUser = ['id', 'nick', 'group'];
        expect(resultForGroup).to.include.keys(expectedForGroup);
        expect(resultForUser).to.include.keys(expectedForUser);
      });
      it('should return non nullable arguments as such', function () {
        const expectedForGroup = {
          id: { type: 'Int!' },
          name: { type: 'String!' },
          members: { type: '[Int]' }
        };
        const expectedForUser = {
          id: { type: 'Int!' },
          nick: { type: 'String!' },
          group: { type: 'Int' }
        };
        expect(resultForGroup).to.deep.equal(expectedForGroup);
        expect(resultForUser).to.deep.equal(expectedForUser);
      });
    });
    describe('#getArgsForDelete(modelName)', function () {
      let resultForGroup;
      let resultForUser;
      before(function () {
        resultForGroup = WT.getArgsForDelete('group');
        resultForUser = WT.getArgsForDelete('user');
      });
      it('should return all the arguments needed to delete an entity of the model', function () {
        const expectedForGroup = ['id'];
        const expectedForUser = ['id'];
        expect(resultForGroup).to.include.keys(expectedForGroup);
        expect(resultForUser).to.include.keys(expectedForUser);
      });
      it('should return non nullable arguments as such', function () {
        const expectedForGroup = {
          id: { type: 'Int!' }
        };
        const expectedForUser = {
          id: { type: 'Int!' }
        };
        expect(resultForGroup).to.deep.equal(expectedForGroup);
        expect(resultForUser).to.deep.equal(expectedForUser);
      });
    });
    describe('#resolveById(modelName)', function () {
      let expectedGroup;
      let expectedUser;
      before(function (done) {
        const g = models.group.findOneById(1).populate('members');
        const u = models.user.findOneById(1).populate('group');
        Promise.all([g, u]).then(result => {
          expectedGroup = result[0];
          expectedUser = result[1];
          done();
        })
        .catch(err => done(err));
      });
      it('should return a function that returns a single entity', function (done) {
        const resultFnGroup = WT.resolveById('group')(null, { id: 1 });
        const resultFnUser = WT.resolveById('user')(null, { id: 1 });
        Promise.all([resultFnGroup, resultFnUser]).then(result => {
          const resultGroup = result[0];
          const resultUser = result[1];
          expect(resultGroup.toObject()).to.deep.equal(expectedGroup.toObject());
          expect(resultUser.toObject()).to.deep.equal(expectedUser.toObject());
          done();
        })
        .catch(err => done(err));
      });
    });
    describe('#resolveAll(modelName)', function () {
      let expectedGroups;
      let expectedUsers;
      before(function (done) {
        const g = models.group.find().populate('members');
        const u = models.user.find().populate('group');
        Promise.all([g, u]).then(result => {
          expectedGroups = result[0];
          expectedUsers = result[1];
          done();
        })
        .catch(err => done(err));
      });
      it('should return a function that returns multiple entities', function (done) {
        const resultFnGroups = WT.resolveAll('group')();
        const resultFnUsers = WT.resolveAll('user')();
        Promise.all([resultFnGroups, resultFnUsers]).then(result => {
          const resultGroups = result[0];
          const resultUsers = result[1];
          expect(resultGroups.map(x => x.toObject())).to.deep.equal(expectedGroups.map(x => x.toObject()));
          expect(resultUsers.map(x => x.toObject())).to.deep.equal(expectedUsers.map(x => x.toObject()));
          done();
        })
        .catch(err => done(err));
      });
    });
    describe('#resolveCreate(modelName)', function () {
      it('should return a function that creates a new entity of the specified model', function (done) {
        const resultCreateForGroup = WT.resolveCreate('group')(null, { name: 'Group 3' });
        const resultCreateForUser = WT.resolveCreate('user')(null, { nick: 'Imlach' });
        Promise.all([resultCreateForGroup, resultCreateForUser])
        .then(result => {
          const g = models.group.findOneById(result[0].id);
          const u = models.user.findOneById(result[1].id);
          return Promise.all([g, u]);
        })
        .then(result => {
          expect(result[0]).to.not.be.undefined;
          expect(result[1]).to.not.be.undefined;
          done();
        })
        .catch(err => done(err));
      });
    });
    describe('#resolveUpdate(modelName)', function () {
      it('should return a function that updates an entity of the specified model', function (done) {
        const resultUpdateForGroup = WT.resolveUpdate('group')(null, { id: 1, name: 'Updated Name' });
        const resultUpdateForUser = WT.resolveUpdate('user')(null, { id: 1, nick: 'Larsvoid', group: 2 });
        Promise.all([resultUpdateForGroup, resultUpdateForUser])
        .then(result => {
          const g = models.group.findOneById(1);
          const u = models.user.findOneById(1).populate('group');
          return Promise.all([g, u]);
        })
        .then(result => {
          expect(result[0].name).to.equal('Updated Name');
          expect(result[1].nick).to.equal('Larsvoid');
          expect(result[1].group.id).to.equal(2);
          done();
        })
        .catch(err => done(err));
      });
    });
    describe('#resolveDelete(modelName)', function () {
      it('should return a function that deletes an entity of the specified model', function (done) {
        const resultDeleteForGroup = WT.resolveDelete('group')(null, { id: 1 });
        const resultDeleteForUser = WT.resolveDelete('user')(null, { id: 1 });
        Promise.all([resultDeleteForGroup, resultDeleteForUser])
        .then(result => {
          const g = models.group.findOneById(1);
          const u = models.user.findOneById(1);
          return Promise.all([g, u]);
        })
        .then(result => {
          expect(result[0]).to.be.undefined;
          expect(result[1]).to.be.undefined;
          done();
        })
        .catch(err => done(err));
      });
    });
    describe('#resolveNodeId(modelName)', function () {
      it('should return a function that resolves an entity of the specified model by its id', function (done) {
        const resultNodeIdForGroup = WT.resolveNodeId('group')(2);
        const resultNodeIdForUser = WT.resolveNodeId('user')(2);
        Promise.all([resultNodeIdForGroup, resultNodeIdForUser])
        .then(result => {
          const g = models.group.findOneById(2).populate('members');
          const u = models.user.findOneById(2).populate('group');
          return Promise.all([g, u, ...result]);
        })
        .then(result => {
          expect(result[0].toObject()).to.deep.equal(result[2].toObject());
          expect(result[1].toObject()).to.deep.equal(result[3].toObject());
          done();
        })
        .catch(err => done(err));
      });
    });
    describe('#resolveIsTypeOf(modelName)', function () {
      it('should return a function that resolves the type of the entities of the specified model', function (done) {
        const g = models.group.findOneById(2).populate('members');
        const u = models.user.findOneById(2).populate('group');
        Promise.all([g, u])
        .then(result => {
          const resultIsTypeOfForGroup = WT.resolveIsTypeOf('group')(result[0]);
          const resultIsTypeOfForUser = WT.resolveIsTypeOf('user')(result[1]);
          expect(resultIsTypeOfForGroup).to.be.true;
          expect(resultIsTypeOfForUser).to.be.true;
          done();
        })
        .catch(err => done(err));
      });
    });
  });

};
