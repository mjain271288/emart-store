const { createGraphqlMutationQuery, axiosPost, graphqQuery } = require('./common')
const { graphqlFiles } = require('./constants');

/**
 * productAddToCart
 * @param {object} req request object
 * @param {string} gqlUrl graphql server url
 * @returns {object} response
 */
const productAddToCart = async (req, gqlUrl) => {
    const graphQlQuery = createGraphqlMutationQuery(graphqlFiles.ADD_TO_CART, req.body);
    return axiosPost(gqlUrl, graphqQuery(graphQlQuery))
}

/**
 * editProductQtyInCart
 * @param {object} req request object
 * @param {string} gqlUrl graphql server url
 * @returns {object} response
 */
const editProductQtyInCart = async (req, gqlUrl) => {
    const editProductObj = {productId:req.params.productId, userId:req.body.userId, quantity:req.body.quantity }
    const graphQlQuery = createGraphqlMutationQuery(graphqlFiles.EDIT_CART_QTY, editProductObj);
    return axiosPost(gqlUrl, graphqQuery(graphQlQuery))
}

/**
 * delete Item From Cart
 * @param {object} req request object
 * @param {string} gqlUrl graphql server url
 * @returns {object} response
 */
const deleteItemFromCart = async (req, gqlUrl) => {
    const mutationData = { productId: parseInt(req.params.productId, 10) };
    const graphQlQuery = createGraphqlMutationQuery(graphqlFiles.DELETE_CART_ITEM, mutationData);
    return axiosPost(gqlUrl, graphqQuery(graphQlQuery))
}

/**
 * getCartItems
 * @param {object} req request object
 * @param {string} gqlUrl graphql server url
 * @returns {object} response
 */
const getCartItems = (req, gqlUrl) => {
    const mutationData = { userId: parseInt(req.params.userId, 10) };
    const graphQlQuery = createGraphqlMutationQuery(graphqlFiles.CART_ITEMS, mutationData);
    return axiosPost(gqlUrl, graphqQuery(graphQlQuery))
}

module.exports = { productAddToCart, editProductQtyInCart, deleteItemFromCart, getCartItems }

