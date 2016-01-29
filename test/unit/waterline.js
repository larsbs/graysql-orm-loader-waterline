'use strict';

const expect = require('chai').expect;
const graphql = require('graphql');
const testModels = require('../support/waterline/test-models');
let models;

module.exports = function(WT){
  describe('@Translator', function(){
    //Setting up the Schema
    before(function() {
      testModels.getWaterlineModels(function(err, result){
        models = result;
      });
    });

    after(function(){
      //Erase .tmp folder
      var fs = require('fs');
      var path = '.tmp';
      var deleteFolderRecursive = function(path) {
        if( fs.existsSync(path) ) {
          fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
        }
      };
      deleteFolderRecursive(path);
    });

    describe('#constructor', function () {
      
      //Testing
      it('should only accepts an object containing waterline models', function (done){
        expect(() => (models)).to.not.throw(TypeError, /Has to be an object/);
        expect(() => new WT(x => x)).to.throw(TypeError, /Has to be an object/);
        expect(() => new WT({})).to.throw(TypeError, /Has to be an object/);
        expect(() => new WT({ group: { waterline: {} }})).to.not.throw(TypeError, /Has to be an object/);
        expect(() => (models.user)).to.not.throw(TypeError, /Has to be an object/);
        done();
      });
    });

    describe('#getModels', function(){
      it('Should return the name of the stored models', function(done){
        const expected = ['user', 'group'];
        const result = new WT(models).getModels();
        expect(result[0]).to.be.a('string');
        expect(result[0]).to.be.equal(expected[0]);
        expect(result[1]).to.be.a('string');
        expect(result[1]).to.be.equal(expected[1]);
        done();
      });
    });

    describe('#getModelById', function(){
      // console.log(new WT(models).getModels());
      it('Should return the desired valid/correct model',function(done){
        testModels.initializeModelsWithData(models).then(function(models){
          return models.user.find();
          // expect(result).toEqual(res);
        }).then(function(a){
          console.log(a);
          done();
        });
      });
    });

    describe('#getModelByCriteria', function(){
      it('Should return the desired valid/correct model according to the passgin args');
    });

    describe('#createModel', function(){
      it('Should return a new correct/valid model');
    });

    describe('#updateModel', function(){
      it('Should return a different model modifying the exting one');
    });

    describe('#getAttributesFrom', function(){
      it('Should return attributes from the passed Model');
    });

    describe('#getAssociationsFrom', function(){
      it('Should return associations from the passed Model');
    });
  });
}
