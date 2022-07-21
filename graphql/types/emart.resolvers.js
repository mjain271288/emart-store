const usersTable = require('../../db/users.json');
const product = require('../../db/product.json');
const cartItems = require('../../db/cartItems.json');
const fs = require('fs');
const _ = require('lodash');
const userJsonFilePath = '../../db/users.json';
const productJsonFilePath = '../../db/product.json';
const cartItemsJsonFilePath = '../../db/cartItems.json';
const path = require('path');

/**
 * write File
 * @param {string} filePath file path
 * @param {object} dataObj dataObj
 */
const writeFile = async (filePath, dataObj) => {
  fs.writeFile(path.join(__dirname, filePath), JSON.stringify(dataObj), (error) => {
    if (error) {
      console.error(`error in writing ${error}`);
      throw error
    }
    console.log(`successfully writeFile done ${filePath}`);
  })
}

module.exports = {
  Query: {
    /**
     * getUserById
     * @param {object} root root
     * @param {Interger} id LoggedIn UserId
     * @returns {object} user data
     */
    async getUserById(root, { id }) {
      const result = usersTable.find((x) => x.Id === id);
      return result
    },

    /**
     * search Product for add to cart
     * @param {object} root root
     * @param {boolean} isActive by default  value is true
     * @param {string} filterText search by product name
     * @returns {Array} product list
     */
    async searchProduct(root, { isActive, filterText }) {
      let results = {}
      if (filterText) {
        results = product.filter((p) => p.isActive === isActive && p.name.includes(filterText));
      }
      else {
        results = product.filter((p) => p.isActive === isActive);
      }
      return results
    },

    /**
     * get Cart Items by UserId
     * @param {object} root
     * @param {boolean} userId LoggedIn UserId
     * @param {string} isActive by default  value is true
     * @returns
     */
    async getCartItemsByUserId(root, { userId, isActive }) {
      const loggedInUserItems = cartItems.filter((c) => c.userId === userId);
      const productDetails = loggedInUserItems.map((ui) => {
        const productDetails = product.find((p) => p.productId === ui.productId && p.isActive === isActive);
        const qty = ui.quantity;
        return { productDetails, qty };
      })
      return productDetails
    },

    /**
     * check Product IsExist or not before adding into cart
     * @param {object} root
     * @param {integer} productId
     * @returns {object} status object
     */
    async checkProductIsExist(root, { productId }) {
      const isExist = product.find((p) => p.productId === productId);
      return { productId, status: !_.isEmpty(isExist) }
    },

    /**
     * searchUser
     * @param {object} root
     * @param {string} name
     * @returns {Array} user list
     */
    async searchUser(root, { firstName }) {
      let results = {};
      if (firstName) {
        results = usersTable.filter((u) => u.firstName.includes(firstName));
      }
      else {
        results = usersTable;
      }
      return results
    }

  },
  Mutation: {

    /**
     * user registration
     * @param {object} root
     * @param {object} args user details under this args
     */
    async addUser(root, args) {
      try {
        const user = Array.isArray(usersTable) ? usersTable : [];
        const userInput = args.userInput;
        userInput.Id = _.random(100000)
        user.push(args.userInput);
        writeFile(userJsonFilePath, user);
        return user;
      }
      catch (error) {
        console.error(error);
        throw error;
      }
    },

    /**
     * create Product
     * @param {*} root
     * @param {*} args args product details under this args
     */
    async createProduct(root, args) {
      try {
        const productList = Array.isArray(product) ? product : [];
        const productObj = args.productInput;
        productObj.productId = _.random(1000000)
        const date = new Date();
        productObj.createdDate = date;
        productObj.updatedDate = date;
        productList.push(productObj);
        writeFile(productJsonFilePath, productList);
        return productList;
      }
      catch (error) {
        console.error(error);
        throw error;
      }
    },

    /**
     * add To Cart
     * @param {object} root
     * @param {object} args product details under this args
     * @returns {object} cart items
     */
    async addToCart(root, args) {
      try {
        console.log(args);
        const cartProducts = Array.isArray(cartItems) ? cartItems : [];
        const body = args;
        body.Id = _.random(10000000)
        const itemExist = cartProducts.find((cp) => cp.productId === body.productId)
        if (!itemExist) {
          cartProducts.push(args)
        }
        writeFile(cartItemsJsonFilePath, cartProducts);
        return cartProducts;
      }
      catch (error) {
        console.error(error);
        throw error;
      }
    },

    /**
     * edit Product Quantity
     * @param {object} root
     * @param {object} productId productId
     * @param {object} quantity new Quantity
     * @param {object} userId userId
     */
    async editProductQuantity(root, { productId, quantity, userId }) {
      try {
        const userProducts = cartItems.map((prod) => {
          if (prod.productId === productId && prod.userId === userId) {
            prod.quantity = quantity;
          }
          return prod;
        })
        if (!_.isEmpty(userProducts) && userProducts.length > 0) {
          writeFile(cartItemsJsonFilePath, userProducts);
        }
        return userProducts;
      }
      catch (error) {
        console.error(error);
        throw error;
      }
    },

    /**
     * delete Card Item
     * @param {object} root
     * @param {integer} productId
     * @param {integer} userId
     * @returns {Array} remaing item list
     */
    async deleteCardItem(root, { productId }) {
      try {
        _.remove(cartItems, function (p) {
          return p.productId === productId;
        });
        if (!_.isEmpty(cartItems) && cartItems.length > 0) {
          writeFile(cartItemsJsonFilePath, cartItems);
        }
        return cartItems;
      }
      catch (error) {
        console.error(error);
        throw error;
      }
    }
  }

}