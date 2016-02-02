'use strict';

const path = require('path');
const rmdir = require('rmdir');
const graphql = require('graphql');
const GraphQLUtils = require('graphql/utilities');
const GraysQL = require('graysql');
const ORMLoader = require('graysql-orm-loader');

const WaterlineTranslator = require('../../src/waterline-translator');
const boostrapWaterline = require('../support/waterline-test');


module.exports = function () {

  describe('WaterlineTranslator Integration Tests', function () {

    let GQL;
    let Schema;
    let ORM;
    let models;
    before(function (done) {
      GQL = new GraysQL();
      GQL.use(ORMLoader);

      boostrapWaterline((m, orm) => {
        ORM = orm;
        models = m.collections;
        try {
          GQL.loadFromORM(new WaterlineTranslator(models));
          Schema = GQL.generateSchema();
        }
        catch (err) {
          return done(err);
        }
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
      it('should allow us to query for all the groups', function (done) {
        console.log(GraphQLUtils.printSchema(Schema));
        models.group.find().then(console.log);
        const query = `query GetGroups {
          groups {
            id,
            name
          }
        }`;
        graphql.graphql(Schema, query)
        .then(result => {
          console.log(result);
        })
        .catch(err => done(err));
      });
    });

  });

}();
