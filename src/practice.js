require('dotenv').config();
const knex = require('knex');

const db = knex({
  // class: 'pg',
  // port: 5432,
  // username: 'dunder_mifflin',
  // password: 'password',
  // databaseName: 'knex_practice',

  // **CHECK THIS OUT
  // this can all be specified in a single URL w/o http protocol
  // this url NEEDS to be protected (.env)
  // connection: 'postgresql://dunder_mifflin:passwordifpresent@localhost:5432/knex_practice'
})

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

// knexInstance
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .where({ name: 'Point of view gun' })
//     .first()
//     .then(result => {
//       console.log(result)
//     })

 
const query = knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where({ name: 'Point of view gun' })
  .first()
  .toQuery()
  .then(result => {
    console.log(result);
  })
  // This will end the terminal session (not destroy the database)
  .finally(() => knexInstance.destroy());
  
// const query = knexInstance('amazong_products')
//  .select(*) <---THIS IS A COMMON SYNTAX THAT OMITS .from
// console.log(query.toQuery()); <-- will console.log the query sent



function searchByProductName(searchTerm) {
  knexInstance('amazong_products')
    .select('product_id', 'name', 'price', 'category')
    // .from('amazong_products') <-- omitted, specified 2 lines above
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

// searchByProductName('holo');

function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page - 1);

  knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}

// paginateProducts(2);

function getProductsWithImages() {
  knexInstance
    .select('product_id', 'name', 'price', 'category', 'image')
    .from('amazong_products')
    .whereNotNull('image')
    .then(result => {
      console.log(result);
    });
}

// getProductsWithImages();

function mostPopularVideosForDays(days) {
  knexInstance
    .select('video_name', 'region')
    .count('date_viewed AS views')
    .where(
      'date_viewed',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    ) // allows for easy operators on time values 
    // '??' protects against SQL injection, the numbers are specified as a second arg
    // multiple '??' can be passed, the following args will be placed in order.
    // if multiple '??' the following args 
    .from('whopipe_video_views')
    .groupBy('video_name', 'region')
    .orderBy([
      { column: 'region', order: 'ASC' },
      { column: 'views', order: 'DESC' },
    ])
    // orderBy allows us to specify ordering ASC or DESC
    .then(result => {
      console.log(result);
    });
}

mostPopularVideosForDays(30);
