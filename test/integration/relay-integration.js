'use strict';

const expect = require('chai').expect;
const path = require('path');
const rmdir = require('rmdir');
const graphql = require('graphql');
const GraphQLUtils = require('graphql/utilities');
const GraysQL = require('graysql');
const ORMLoader = require('graysql-orm-loader');

const WaterlineTranslator = require('../../src/waterline-translator');
const bootstrapWaterline = require('../support/waterline-test');


module.exports = function () {

  describe('WaterlineTranslator Relay Integration', function () {

    let GQL;
    let Schema;
    let ORM;
    let models;
    before(function (done) {
      GQL = new GraysQL();
      GQL.use(ORMLoader);

      bootstrapWaterline((m, orm) => {
        ORM = orm;
        models = m.collections;
        try {
          GQL.loadFromORM(new WaterlineTranslator(models), { relay: true });
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
        const query = `query GetGroups {
          groups {
            id,
            name
          }
        }`;
        const expected = {
          data: {
            groups: [{
              id: 1,
              name: 'Group 1'
            }, {
              id: 2,
              name: 'Group 2'
            }]
          }
        };
        graphql.graphql(Schema, query)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
      });
    });

  });

}();
