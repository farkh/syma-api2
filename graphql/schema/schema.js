const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        username: String!
        token: String!
        tokenExpiration: Int!
        categories: [Category!]
        userSettings: UserSettings!
        transactions: [Transaction!]
        requiredTransactions: [RequiredTransaction!]
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
        paydate: Int!
        advanced_date: Int
        curr_balance: Int!
        isSavedThisMonth: Boolean!
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

    input UserSettingsInput {
        savings_percent: Int
        paydate: Int
        advance_date: Int
        curr_balance: Float
        isSavedThisMonth: Boolean
    }

    input RequiredTransactionInput {
        category_id: String!
        type: Int!
        description: String!
        amount: Float!
        date: Int!
    }

    type RootQuery {
        login(email: String!, password: String!): User
        verifyToken(token: String!): User
        category(_id: ID!): Category
        categories: [Category!]
        categoriesByType(type: Int!): [Category!]
        transaction(_id: ID!): Transaction
        transactions: [Transaction!]
        transactionsByType(type: Int!): [Transaction!]
        requiredTransaction(_id: ID!): RequiredTransaction
        requiredTransactions: [RequiredTransaction!]
        requiredTransactionsByType(type: Int!): [RequiredTransaction!]
        userSettings(user_id: ID!): UserSettings
    }

    type RootMutation {
        createUser(userInput: UserInput): User
        createCategory(category: CategoryInput): Category
        createTransaction(transaction: TransactionInput): Transaction
        createRequiredTransaction(requiredTransaction: RequiredTransactionInput): RequiredTransaction
        createUserSettings: UserSettings
        updateUserSettings(userSettings: UserSettingsInput): UserSettings
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
