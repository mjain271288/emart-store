const { createGraphqlMutationQuery, axiosPost, graphqQuery } = require('./common')
const { graphqlFiles } = require('./constants');
const { getOr } = require('lodash/fp');

/**
 * create User
 * @param {object} req request object
 * @param {string} gqlUrl graphql server url
 * @returns {object} response
 */
const createUser = async (req, gqlUrl) => {
    const graphQlQuery = createGraphqlMutationQuery(graphqlFiles.CREATE_USER, req.body);
    return axiosPost(gqlUrl, graphqQuery(graphQlQuery));
}

/**
 * searchUser
 * @param {object} req request object
 * @param {string} gqlUrl graphql server url
 * @returns {object} response
 */
const searchUser = async (req, gqlUrl) => {
    const firstName = (getOr('', 'params.firstName', req) === 'undefined' || getOr('', 'params.firstName', req) === '{firstName}') ? '' : getOr('', 'params.firstName', req);
    const graphQlQuery = createGraphqlMutationQuery(graphqlFiles.SEARCH_USER, { firstName });
    return axiosPost(gqlUrl, graphqQuery(graphQlQuery))
}

module.exports = { createUser, searchUser }

