const { createGraphqlMutationQuery, axiosPost, graphqQuery } = require('./common')
const { graphqlFiles } = require('./constants');
const { getOr } = require('lodash/fp');

/**
 * createProduct
 * @param {object} req request object
 * @param {string} gqlUrl graphql server url
 * @returns {object} response
 */
const createProduct = async (req, gqlUrl) => {
    const graphQlQuery = createGraphqlMutationQuery(graphqlFiles.CREATE_PRODUCT, req.body);
    return axiosPost(gqlUrl, graphqQuery(graphQlQuery));
}

/**
 * searchProduct
 * @param {object} req request object
 * @param {string} gqlUrl graphql server url
 * @returns {object} response
 */
const searchProduct = async (req, gqlUrl) => {
    const filterText = (getOr('', 'params.filterText', req) === 'undefined' || getOr('', 'params.filterText', req) === '{filterText}') ? '' : getOr('', 'params.filterText', req);
    const graphQlQuery = createGraphqlMutationQuery(graphqlFiles.SEARCH_PRODUCT, { filterText });
    return axiosPost(gqlUrl, graphqQuery(graphQlQuery))
}

/**
 * check isProductExist in store before add into cart
 * @param {object} productObj
 * @param {string} gqlUrl
 * @returns {object} product id and status
 */
const isProductExist = async (productObj, gqlUrl) => {
    const graphQlQuery = createGraphqlMutationQuery(graphqlFiles.IS_PRODUCT_EXIST, productObj);
    return axiosPost(gqlUrl, graphqQuery(graphQlQuery))
}

module.exports = { createProduct, searchProduct, isProductExist }

