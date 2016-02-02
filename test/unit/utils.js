'use strict';

const expect = require('chai').expect;


module.exports = function (Utils) {

  describe('@Utils', function () {

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
    describe('#makeCircularJSON(entity, models)', function () {
      let expectedForGroup;
      let expectedForUser;
      before(function () {
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
      });
      it.skip('should populate all associations in the entity', function () {
      });
      it.skip('should make every association reference the original entity back', function () {
      });
    });

  });

}(require('../../src/utils'));
