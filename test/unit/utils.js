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
      it('should return `Int` for type `integer`');
      it('should return `String` for type `string`');
      it('should return `Date` for type `datetime`');
      it('should throw an error for an unknown type');
    });

  });

};
