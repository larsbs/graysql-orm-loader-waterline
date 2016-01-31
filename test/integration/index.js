'use strict';

const path = require('path');
const rmdir = require('rmdir');
const graphql = require('graphql');
const GraysQL = require('graysql');
const ORMLoader = require('graysql-orm-loader');

const WaterlineTranslator = require('../../src/waterline-translator');
const boostrapWaterline = require('../support/waterline-test');


module.exports = function () {

  describe('WaterlineTranslator Integration Tests', function () {

    let GQL;
    let Schema;
    let ORM;
    before(function (done) {
      GQL = new GraysQL();
      GQL.use(ORMLoader);

      boostrapWaterline((models, orm) => {
        GQL.loadFromORM(new WaterlineTranslator(models.collections));
        Schema = GQL.generateSchema();
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

    describe('Basic Queries', function () {
      it('should allow us to query for all the groups', function () {
        console.log(Schema);
      });
    });

  });

};
