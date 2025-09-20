
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CreatorsDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const creators = await db.creators.create(
            {
                id: data.id || undefined,

        profile_description: data.profile_description
        ||
        null
            ,

        total_tipped: data.total_tipped
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return creators;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const creatorsData = data.map((item, index) => ({
                id: item.id || undefined,

                profile_description: item.profile_description
            ||
            null
            ,

                total_tipped: item.total_tipped
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const creators = await db.creators.bulkCreate(creatorsData, { transaction });

        return creators;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const creators = await db.creators.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.profile_description !== undefined) updatePayload.profile_description = data.profile_description;

        if (data.total_tipped !== undefined) updatePayload.total_tipped = data.total_tipped;

        updatePayload.updatedById = currentUser.id;

        await creators.update(updatePayload, {transaction});

        return creators;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const creators = await db.creators.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of creators) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of creators) {
                await record.destroy({transaction});
            }
        });

        return creators;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const creators = await db.creators.findByPk(id, options);

        await creators.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await creators.destroy({
            transaction
        });

        return creators;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const creators = await db.creators.findOne(
            { where },
            { transaction },
        );

        if (!creators) {
            return creators;
        }

        const output = creators.get({plain: true});

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

                if (filter.profile_description) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'creators',
                            'profile_description',
                            filter.profile_description,
                        ),
                    };
                }

            if (filter.total_tippedRange) {
                const [start, end] = filter.total_tippedRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    total_tipped: {
                    ...where.total_tipped,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    total_tipped: {
                    ...where.total_tipped,
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
            const { rows, count } = await db.creators.findAndCountAll(queryOptions);

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
                        'creators',
                        'profile_description',
                        query,
                    ),
                ],
            };
        }

        const records = await db.creators.findAll({
            attributes: [ 'id', 'profile_description' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['profile_description', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.profile_description,
        }));
    }

};

