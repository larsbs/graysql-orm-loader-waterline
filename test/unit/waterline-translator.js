'use strict';


module.exports = function (WT) {

  describe('@WaterlineTranslator', function () {
    describe('#constructor(models)', function () {
      it('should only accepts an object containing waterline models');
    });
    describe('#getModelsNames()', function () {
      it('should returns an array containing the names of the stored models');
    });
    describe('#parseModelProperties(modelName)', function () {
      it('should returns an object containing valid GraysQL fields');
      it('should returns all the properties of the model');
      it('should not returns associations of the model')
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
      it('should return a single entity');
      it('should return an entity of the specified model');
    });
    describe('#resolveAll(modelName)', function () {
    });
    describe('#resolveCreate(modelName)', function () {
    });
    describe('#resolveUpdate(modelName)', function () {
    });
    describe('#resolveDelete(modelName)', function () {
    });
    describe('#resolveNodeId(modelName)', function () {
    });
    describe('#resolveIsTypeOf(modelName)', function () {
    });
  });

};
