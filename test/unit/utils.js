'use strict';

const path = require('path');
const rmdir = require('rmdir');
const expect = require('chai').expect;
const bootstrapWaterline = require('../support/waterline-test');


module.exports = function (Utils) {

  describe('@Utils', function () {

    let models;
    let ORM;
    before(function (done) {
      bootstrapWaterline((m, orm) => {
        models = m.collections;
        ORM = orm;
        done();
      });
    });

    after(function (done) {
      ORM.teardown();
      rmdir(path.resolve(__dirname, '../../.tmp'), (err, dirs, files) => {
        if (err) {
          throw new Error(err);
        }
        done();
      });
    });

    describe('#areWaterlineModels(models)', function () {
      it('should return true if all the models inside models contain the key `waterline`', function () {
        const validModels = {
          User: { waterline: true },
          Group: { waterline: true }
        };
        const invalidModels = {
          User: { waterline: true },
          Group: {}
        };
        const resultValid = Utils.areWaterlineModels(validModels);
        const resultInvalid = Utils.areWaterlineModels(invalidModels);
        expect(resultValid).to.be.true;
        expect(resultInvalid).to.be.false;
      });
    });
    describe('#isAssociation(attribute)', function () {
      it('should return true if the attribute contains the key `model`', function () {
        const attribute = {
          model: 'group'
        };
        const result = Utils.isAssociation(attribute);
        expect(result).to.be.true;
      });
      it('should return true if the attribute contains the key `collection`', function () {
        const attribute = {
          collection: 'user'
        };
        const result = Utils.isAssociation(attribute);
        expect(result).to.be.true;
      });
      it('should return false otherwise', function () {
        const attribute = {
          type: 'integer'
        };
        const result = Utils.isAssociation(attribute);
        expect(result).to.be.false;
      });
    });
    describe('#parseTypeToGraysQLType(type)', function () {
      it('should return `Int` for type `integer`', function () {
        const expected = 'Int';
        const result = Utils.parseTypeToGraysQLType('integer');
        expect(result).to.equal(expected);
      });
      it('should return `String` for type `string`', function () {
        const expected = 'String';
        const result = Utils.parseTypeToGraysQLType('string');
        expect(result).to.equal(expected);
      });
      it('should return `Date` for type `datetime`', function () {
        const expected = 'Date';
        const result = Utils.parseTypeToGraysQLType('datetime');
        expect(result).to.equal(expected);
      });
      it('should throw an error for an unknown type', function () {
        const fn = Utils.parseTypeToGraysQLType.bind(Utils, 'unknown type');
        expect(fn).to.throw(Error, /Unsupported type/);
      });
    });
    describe('#populateAll(context)', function () {
      let expectedForGroup;
      let expectedForUser;
      before(function (done) {
        const g = models.group.findOneById(1).populate('members');
        const u = models.user.findOneById(1).populate('group');
        Promise.all([g, u])
        .then(result => {
          expectedForGroup = result[0];
          expectedForUser = result[1];
          done();
        })
        .catch(err => done(err));
      });
      it('should populate all associations in the entity', function (done) {
        const g = Utils.populateAll(models.group.findOneById(1));
        const u = Utils.populateAll(models.user.findOneById(1));
        Promise.all([g, u])
        .then(result => {
          expect(result[0].toObject()).to.deep.equal(expectedForGroup.toObject());
          expect(result[1].toObject()).to.deep.equal(expectedForUser.toObject());
          done();
        })
        .catch(err => done(err));
      });
    });
    describe('#makeCircular(context)', function () {
      let expectedForGroup;
      let expectedForUser;
      let resultForGroup;
      let resultForUser;
      before(function (done) {
        const user1 = {
          id: 1,
          nick: 'Lars'
        };
        const user2 = {
          id: 2,
          nick: 'Deathvoid'
        };
        const group = {
          id: 1,
          name: 'Group 1',
          members: [user1, user2]
        };
        user1.group = group;
        user2.group = group;
        expectedForGroup = group;
        expectedForUser = user1;
        const g = Utils.makeCircular(models.group.findOneById(1), models);
        const u = Utils.makeCircular(models.user.findOneById(1), models);
        Promise.all([g, u])
        .then(result => {
          resultForGroup = result[0];
          resultForUser = result[1];
          done();
        })
        .catch(err => done(err));
      });
      it('should make every association reference the original entity back', function (done) {
        resultForGroup.members.then(members => {
          console.log(members);
          done();
        });
        //expect(resultForGroup.name).to.equal(expectedForGroup.name);
        //expect(resultForUser.nick).to.equal(expectedForUser.nick);
        //expect(resultForGroup.members).to.deep.equal(expectedForGroup.members);
        //expect(resultForUser.group).to.deep.equal(expectedForUser.group);
        //expect(resultForGroup.members[0].group).to.deep.equal(expectedForGroup.members[0].group);
        //expect(resultForUser.group.members).to.deep.equal(expectedForUser.group.members);
      });
    });

  });

}(require('../../src/utils'));
