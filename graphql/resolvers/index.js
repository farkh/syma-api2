const authResolver = require('./auth.resolver');
const categoryResolver = require('./category.resolver');
const transactionResolver = require('./transaction.resolver');

const rootresolver = {
    ...authResolver,
    ...categoryResolver,
    ...transactionResolver,
};

module.exports = rootresolver;
