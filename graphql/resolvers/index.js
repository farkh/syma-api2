const authResolver = require('./auth.resolver');
const categoryResolver = require('./category.resolver');
const transactionResolver = require('./transaction.resolver');
const requiredTransactionResolver = require('./requiredTransaction.resolver');

const rootresolver = {
    ...authResolver,
    ...categoryResolver,
    ...transactionResolver,
    ...requiredTransactionResolver,
};

module.exports = rootresolver;
