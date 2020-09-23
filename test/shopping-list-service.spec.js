/* eslint-disable quotes */
const ShoppingService = require('../src/shopping-list-service');
const knex = require('knex');
const { expect } = require('chai');



describe(`Shopping List service object`, () => {
  let db;
  let testShoppingItems = [
    {
      id: 1,
      name: 'Buffalo sauce',
      price: "2.99",
      date_added: new Date('2020-01-22T16:28:32.615Z'),
      checked: false,
      category: 'Main'
    },
    {
      id: 2,
      name: 'Chicken tenders',
      price: "7.99",
      date_added: new Date('2020-02-22T16:28:32.615Z'),
      checked: true,
      category: 'Lunch'
    },
    {
      id: 3,
      name: 'Pizza',
      price: "10.99",
      date_added: new Date('2019-03-22T16:28:32.615Z'),
      checked: false,
      category: 'Main'
    },
  ];

  before('setup database', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  // if the after each is removing the data, this before remove all data
  // is somewhat redundant.
  before(() => db('shopping_list').truncate());

  // after each test remove all data
  afterEach(() => db('shopping_list').truncate());

  // destroy - destroys the CONNECTION to the database
  after('destroy connection', () => db.destroy());

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testShoppingItems);
    });

    it(`getAllShoppingItems() resolves all items from 'shopping_list' table`, () => {
      return ShoppingService.getAllShoppingItems(db)
        .then(actual => {
          expect(actual).to.eql(testShoppingItems);
        });
    });

    it(`getById() resolves a shopping_item by id from 'blogful_articles' table`, () => {
      const thirdId = 3;
      const thirdShoppingItem = testShoppingItems[thirdId - 1];
      return ShoppingService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdShoppingItem.id,
            name: thirdShoppingItem.name,
            price: thirdShoppingItem.price,
            date_added: thirdShoppingItem.date_added,
            checked: thirdShoppingItem.checked,
            category: thirdShoppingItem.category,
          });
        });
    });


    it(`deleteShoppingItem() removes a shoppingItem by id from 'shopping_item' table`, () => {
      const shoppingItemId = 3;
      return ShoppingService.deleteShoppingItem(db, shoppingItemId)
        .then(() => ShoppingService.getAllShoppingItems(db))
        .then(allItems => {
          // copy the test articles array without the "deleted" article
          const expected = testShoppingItems
            .filter(item => item.id !== shoppingItemId);
          expect(allItems).to.eql(expected);
        });
    });

    it(`updateShoppingItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: 'New Item',
        price: "10.99",
        date_added: new Date('2019-03-22T16:28:32.615Z'),
        checked: false,
        category: 'Main'
      };
      return ShoppingService.updateShoppingItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData,
          });
        });
    });
  });


  context(`Given 'blogful_articles' has no data`, () => {
    it(`getAllArticles() resolves to an empty array`, () => {
      return ShoppingService.getAllShoppingItems(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });
  });

  it(`insertShoppingItem() inserts a new item and resolves the new item with an 'id'`, () => {
    const newItem = {
      name: 'New Pizza',
      price: "10.99",
      date_added: new Date('2019-03-22T16:28:32.615Z'),
      checked: false,
      category: 'Main'
    };
    return ShoppingService.insertShoppingItem(db, newItem)
      .then(actual => {
        expect(actual).to.eql({
          id: 1,
          name: newItem.name,
          price: newItem.price,
          date_added: newItem.date_added,
          checked: newItem.checked,
          category: newItem.category
        });
      });
  });
});
