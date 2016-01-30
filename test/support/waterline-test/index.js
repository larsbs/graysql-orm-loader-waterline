const Waterline = require('waterline');
const Models = require('./models');
const config = require('./config');


const ORM = new Waterline();
ORM.loadCollection(Models.Group);
ORM.loadCollection(Models.User);


module.exports = function bootstrap(cb) {
  ORM.initialize(config, (err, models) => {
    if (err) {
      throw new Error(err);
    }

    const User = models.collections.user;
    const Group = models.collections.group;

    // Create some sample data
    const g1 = Group.create({
      name: 'Group 1'
    });
    const g2 = Group.create({
      name: 'Group 2'
    });
    const u1 = User.create({
      nick: 'Lars'
    });
    const u2 = User.create({
      nick: 'Deathvoid'
    });
    const u3 = User.create({
      nick: 'Grishan'
    });
    Promise.all([g1, g2, u1, u2, u3]).then(values => {
      const group1 = values[0];
      const group2 = values[1];
      const user1 = values[2];
      const user2 = values[3];
      const user3 = values[4];

      group1.members.add([user1, user2]);
      group2.members.add([user3]);
      Promise.all([group1.save(), group2.save()]).then(cb(models));
    })
    .catch(err => console.error(err));
  });
};
