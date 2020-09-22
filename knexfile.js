// Update with your config settings.
require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: 'postgresql://dunder_mifflin@localhost/knex-practice',
});

// module.exports = {

//   staging: {
//     client: 'pg',
//     connection: {
//       database: 'knex-practice',
//       user:     'dunder_mifflin',
//       // password: 'password'
//     }
//   },

knexInstance.from('amazong_products').select('*')
  .then(result => {
    console.log(result);
  });


