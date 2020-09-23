require('dotenv').config();
const knex = require('knex');

const ShoppingService = require('./shopping-list-service');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function searchByProductName(searchTerm) {
  ShoppingService.getAllShoppingItems(knexInstance)
    .select('id', 'name', 'price', 'category')
    // .from('amazong_products') <-- omitted, specified 2 lines above
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

// searchByProductName('chili');

function paginateProducts(page) {
  const productsPerPage = 10;
  const offset = productsPerPage * (page - 1);

  knexInstance('shopping_list')
    .select('id', 'name', 'price', 'category')    
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    })
    .catch(err => console.error(err))
    .finally(() => {
      knexInstance.destroy();
    });
}

paginateProducts(2);

function getItemsAddedAfterDate(daysAgo) {
  knexInstance('shopping_list')
    .select('id', 'name', 'date_added', 'category')    
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .groupBy('id')      
    .then(result => {
      console.log(result);
    })
    .catch(err => console.error(err))
    .finally(() => {
      knexInstance.destroy();
    });
}

// getItemsAddedAfterDate(10);
function getTotalPriceByCategory() {
  knexInstance('shopping_list')
    .select('category')
    .sum('price as total')
    .groupBy('category')
    .then(result => {
      console.log(result);
    })
    .catch(err => console.error(err))
    .finally(() => {
      knexInstance.destroy();
    });
}

getTotalPriceByCategory();