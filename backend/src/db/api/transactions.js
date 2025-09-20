
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class TransactionsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const transactions = await db.transactions.create(
            {
                id: data.id || undefined,

        amount: data.amount
        ||
        null
            ,

        transaction_type: data.transaction_type
        ||
        null
            ,

        transaction_date: data.transaction_date
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return transactions;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const transactionsData = data.map((item, index) => ({
                id: item.id || undefined,

                amount: item.amount
            ||
            null
            ,

                transaction_type: item.transaction_type
            ||
            null
            ,

                transaction_date: item.transaction_date
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const transactions = await db.transactions.bulkCreate(transactionsData, { transaction });

        return transactions;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const transactions = await db.transactions.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.amount !== undefined) updatePayload.amount = data.amount;

        if (data.transaction_type !== undefined) updatePayload.transaction_type = data.transaction_type;

        if (data.transaction_date !== undefined) updatePayload.transaction_date = data.transaction_date;

        updatePayload.updatedById = currentUser.id;

        await transactions.update(updatePayload, {transaction});

        return transactions;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const transactions = await db.transactions.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of transactions) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of transactions) {
                await record.destroy({transaction});
            }
        });

        return transactions;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const transactions = await db.transactions.findByPk(id, options);

        await transactions.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await transactions.destroy({
            transaction
        });

        return transactions;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const transactions = await db.transactions.findOne(
            { where },
            { transaction },
        );

        if (!transactions) {
            return transactions;
        }

        const output = transactions.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

            if (filter.amountRange) {
                const [start, end] = filter.amountRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    amount: {
                    ...where.amount,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    amount: {
                    ...where.amount,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.transaction_dateRange) {
                const [start, end] = filter.transaction_dateRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    transaction_date: {
                    ...where.transaction_date,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    transaction_date: {
                    ...where.transaction_date,
                            [Op.lte]: end,
                    },
                };
                }
            }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.transaction_type) {
                where = {
                    ...where,
                transaction_type: filter.transaction_type,
            };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.transactions.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'transactions',
                        'transaction_type',
                        query,
                    ),
                ],
            };
        }

        const records = await db.transactions.findAll({
            attributes: [ 'id', 'transaction_type' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['transaction_type', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.transaction_type,
        }));
    }

};

