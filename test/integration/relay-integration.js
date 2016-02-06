'use strict';

const expect = require('chai').expect;
const path = require('path');
const rmdir = require('rmdir');
const graphql = require('graphql');
const GraphQLUtils = require('graphql/utilities');
const GraysQL = require('graysql');
const Graylay = require('graysql/extensions/graylay');
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
      GQL.use(Graylay);
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
              id: 'Z3JvdXA6MQ==',
              name: 'Group 1'
            }, {
              id: 'Z3JvdXA6Mg==',
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
      it('should allow us to query for all the users', function (done) {
        const query = `query GetUsers {
          users {
            id,
            nick
          }
        }`;
        const expected = {
          data: {
            users: [{
              id: 'dXNlcjox',
              nick: 'Lars'
            }, {
              id: 'dXNlcjoy',
              nick: 'Deathvoid'
            }, {
              id: 'dXNlcjoz',
              nick: 'Grishan'
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
      it('should allow us to query for a single group', function (done) {
        const query = `query GetGroup {
          group(id: 1) {
            id,
            name
          }
        }`;
        const expected = {
          data: {
            group: {
              id: 'Z3JvdXA6MQ==',
              name: 'Group 1'
            }
          }
        };
        graphql.graphql(Schema, query)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
      });
      it('should allow us to query for a single user', function (done) {
        const query = `query GetUser {
          user(id: 1) {
            id,
            nick
          }
        }`;
        const expected = {
          data: {
            user: {
              id: 'dXNlcjox',
              nick: 'Lars'
            }
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

    describe('Relationship Queries', function () {
      it('should allow us to query for the members of a group', function (done) {
        const query = `query GetFullGroup {
          group(id: 1) {
            id,
            name,
            members {
              edges {
                node {
                  id,
                  nick
                }
              }
            }
          }
        }`;
        const expected = {
          data: {group: {
            id: 'Z3JvdXA6MQ==',
            name: 'Group 1',
            members: {
              edges: [{
                node: {
                  id: 'dXNlcjox',
                  nick: 'Lars'
                }
              }, {
                node: {
                  id: 'dXNlcjoy',
                  nick: 'Deathvoid'
                }
              }]
            }
          }}
        };
        graphql.graphql(Schema, query)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
      });
      it('should allow us to query for the group of an user', function (done) {
        const query = `query GetFullUser {
          user(id: 1) {
            id,
            nick,
            group {
              id,
              name
            }
          }
        }`;
        const expected = {
          data: {user: {
            id: 'dXNlcjox',
            nick: 'Lars',
            group: {
              id: 'Z3JvdXA6MQ==',
              name: 'Group 1'
            }
          }}
        };
        graphql.graphql(Schema, query)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
      });
    });

    describe('Circular Queries', function () {
      it('should allow us to query for the group of the members of a group', function (done) {
        const query = `query GetCircularGroup {
          group(id: 1) {
            id,
            name,
            members {
              edges {
                node {
                  id,
                  nick,
                  group {
                    id
                  }
                }
              }
            }
          }
        }`;
        const expected = {
          data: {group: {
            id: 'Z3JvdXA6MQ==',
            name: 'Group 1',
            members: {
              edges: [{
                node: {
                  id: 'dXNlcjox',
                  nick: 'Lars',
                  group: { id: 'Z3JvdXA6MQ==' }
                }
              }, {
                node: {
                  id: 'dXNlcjoy',
                  nick: 'Deathvoid',
                  group: { id: 'Z3JvdXA6MQ==' }
                }
              }]
            }
          }}
        };
        graphql.graphql(Schema, query)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
      });
      it('should allow us to query for the members of the group of an user', function (done) {
        const query = `query GetCircularUser {
          user(id: 1) {
            id,
            nick,
            group {
              id,
              name,
              members {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }`;
        const expected = {
          data: {user: {
            id: 'dXNlcjox',
            nick: 'Lars',
            group: {
              id: 'Z3JvdXA6MQ==',
              name: 'Group 1',
              members: {edges: [{
                node: { id: 'dXNlcjox' }
              }, {
                node: { id: 'dXNlcjoy' }
              }]}
            }
          }}
        };
        graphql.graphql(Schema, query)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
      });
    });

    describe('Basic Mutations', function () {
      it('should allow us to create a new user', function (done) {
        const mutation = `mutation AddUser {
          createUser(nick: "Imlach") {
            id,
            nick
          }
        }`;
        const expected = {
          data: {
            createUser: {
              id: 'dXNlcjo0',
              nick: 'Imlach'
            }
          }
        };
        graphql.graphql(Schema, mutation)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
      });
      it('should allow us to create a new group', function (done) {
        const mutation = `mutation AddGroup {
          createGroup(name: "Group 3") {
            id,
            name
          }
        }`;
        const expected = {
          data: {
            createGroup: {
              id: 'Z3JvdXA6Mw==',
              name: 'Group 3'
            }
          }
        };
        graphql.graphql(Schema, mutation)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
      });
      it('should allow us to update an user', function (done) {
        const mutation = `mutation UpdateUser {
          updateUser(id: 1, nick: "Fienhard") {
            id,
            nick
          }
        }`;
        const expected = {
          data: {
            updateUser: {
              id: 'dXNlcjox',
              nick: 'Fienhard'
            }
          }
        }
        graphql.graphql(Schema, mutation)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
      });
      it('should allow us to update a group', function (done) {
        const mutation = `mutation UpdateGroup {
          updateGroup(id: 1, name: "Group One") {
            id,
            name
          }
        }`;
        const expected = {
          data: {
            updateGroup: {
              id: 'Z3JvdXA6MQ==',
              name: 'Group One'
            }
          }
        };
        graphql.graphql(Schema, mutation)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
      });
      it('should allow us to delete an user', function (done) {
        const mutation = `mutation DeleteUser {
          deleteUser(id: 2) {
            id,
            nick
          }
        }`;
        const expected = {
          data: {
            deleteUser: {
              id: 'dXNlcjoy',
              nick: 'Deathvoid'
            }
          }
        };
        graphql.graphql(Schema, mutation)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
      });
      it('should allow us to delete a group', function (done) {
        const mutation = `mutation DeleteGroup {
          deleteGroup(id: 2) {
            id,
            name
          }
        }`;
        const expected = {
          data: {
            deleteGroup: {
              id: 'Z3JvdXA6Mg==',
              name: 'Group 2'
            }
          }
        };
        graphql.graphql(Schema, mutation)
        .then(result => {
          expect(result).to.deep.equal(expected);
          done();
        })
        .catch(err => done(err));
      });
    });

  });

}();
