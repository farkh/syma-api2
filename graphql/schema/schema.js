const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        username: String!
        token: String!
    }

    type Category {
        _id: ID!
        user_id: User!
        type: Int!
        name: String!
    }

    type Transaction {
        _id: ID!
        user_id: User!
        category_id: Category!
        type: Int!
        description: String!
        amount: Float!
        datetime: String!
    }

    type RequiredTransaction {
        _id: ID!
        user_id: User!
        category_id: Category!
        type: Int!
        description: String!
        amount: Float!
        date: String!
    }

    type UserSettings {
        _id: ID!
        user_id: User!
        total_income: Float!
        total_required_expenses: Float!
        savings_percent: Int!
        day_limit: Float!
    }

    input UserInput {
        email: String!
        username: String!
        password: String!
        confirm: String!
    }

    input CategoryInput {
        type: Int!
        name: String!
    }

    input TransactionInput {
        category_id: String!
        type: Int!
        description: String!
        amount: Float!
    }

    input RequiredTransactionInput {
        category_id: String!
        type: Int!
        description: String!
        amount: Float!
    }

    type RootQuery {
        login(email: String!, password: String!): User
        verifyToken(token: String!): User
        category(_id: ID!): Category
        categories: [Category]
        transaction(_id: ID!): Transaction
        transactions: [Transaction]
        requiredTransaction(_id: ID!): RequiredTransaction
        requiredTransactions: [RequiredTransaction]
        userSettings(user_id: ID!): UserSettings
    }

    type RootMutation {
        createUser(userInput: UserInput): User
        createCategory(category: CategoryInput): Category
        createTransaction(transaction: TransactionInput): Transaction
        createRequiredTransaction(requiredTransaction: RequiredTransactionInput): RequiredTransaction
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
