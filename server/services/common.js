const axios = require('axios');
const handlebars = require('handlebars')
const fs = require('fs');
const { getOr } = require('lodash/fp');

/**
 * createGraphqlMutationQuery
 * @param {string} graphQLFileName graphQLFileName
 * @param {object} mutationData mutationData
 * @param {string} fileExtension fileExtension
 * @returns {string} graphql string
 */
const createGraphqlMutationQuery = (graphQLFileName, mutationData, fileExtension = 'graphql') => {
    const queryPath = `${__dirname}/graphqlFiles/${graphQLFileName}.${fileExtension}`;
    const graphqlQueryFile = fs.readFileSync(queryPath);
    const queryTemplate = handlebars.compile(graphqlQueryFile.toString());
    const graphQlQuery = queryTemplate(mutationData);
    return graphQlQuery;
}

/**
 * getHeader
 * @returns {object} request options
 */
const getHeader = () => {
    return {
        accept: 'application/json',
        'Content-Type': 'application/json',
    };
}

/**
 * axios Post
 * @param {string} url url
 * @param {object} dataObj request payload
 * @returns {object} response
 */
const axiosPost = async (url, dataObj) => {
    const response = await axios.post(url, dataObj, getHeader())
    return getOr([], 'data.data', response);
}

/**
 * graphqQuery
 * @param {string} graphQlQuery
 * @returns {string} graphql Query
 */
const graphqQuery = (graphQlQuery) => {
    return {
        query: `${graphQlQuery}`,
    };
}
module.exports = { createGraphqlMutationQuery, axiosPost, graphqQuery }