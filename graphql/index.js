const path = require('path');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

const typesArray = loadFilesSync(path.join(__dirname, './types/**/*.graphql'));
const resolversArray = loadFilesSync(path.join(__dirname, './types/**/*.resolvers.js'));

// export a compiled schema
module.exports = {
    typeDefs: mergeTypeDefs(typesArray),
    resolvers: mergeResolvers(resolversArray),
};
