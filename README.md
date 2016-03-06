# Waterline Translator #

This is a translator for [graysql-orm-loader](https://github.com/larsbs/graysql-orm-loader) that will translate
the models defined in Waterline to a valid GraphQL schema.

> PD: If you want a simpler way to integrate this with a Sails.js application, check [sails-hook-graysql](https://github.com/larsbs/sails-hook-graysql).

## Installation ##

Install it from npm. Make sure to install its peer-dependencies as well.

```bash
$ npm install graysql-orm-waterline
```

## Examples ##

Here is an example using [Sails.js](http://sailsjs.org/) and [Waterline](https://github.com/balderdashy/waterline).

```javascript
const GraysQL = require('graysql');
const ORMLoader = require('graysql-orm-loader');
const WaterlineTranslator = require('graysql-orm-loader-waterline');

const GQL = new GraysQL();
GQL.use(ORMLoader);

GQL.loadFromORM(new WaterlineTranslator(sails.models));
const Schema = GQL.generateSchema();
```

## Examples ##

Usage example can be found in [example]() directory.

## Tests ##

The tests are written with [mocha](https://mochajs.org/) and can be run with the following command:

```bash
$ npm test
```

To get code coverage reports, run the following command:

```bash
$ npm run cover
```

## License ##

[MIT]()
