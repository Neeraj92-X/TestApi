const makeDb = require("../../config/db");
const config = require("config").get("database");
const dbError = require('../handler/errorHandler');
const eventLogger = require('../../logger/eventLogger');
const helpers = require('../helpers/index');
const con = require("../constants/index");



const commonServices = {
    getEmailTemplate: async (req, templateTitle) => {
        const db = makeDb(config);
        try {
            return await db.query("select * from master_mail_templates where title = ? limit 1", [templateTitle]);
        } catch (error) {
            throw new dbError("Database error", error);
        } finally {
            await db.close();
        }
    },

    //Returns single record for query
    //table = any table name from which we need to fetch data
    //keys = comma seperated string of table field which we need to get from database
    //condition = basically it is for data filtering, it is an object, in which key is mapped with table field
    //and value with field value
    readSingleData: async (req, table, keys, condition) => {
        const db = makeDb(config);
        try {
            var conditionQuery = "";
            let conditionValues = [];
            for (let element in condition) {
                if (Array.isArray(condition[element])) {
                    conditionQuery += conditionQuery == "" ? `WHERE ${element} IN(?)` : ` AND ${element} IN(?)`;
                    conditionValues.push(condition[element]);
                } else {
                    conditionQuery += conditionQuery == "" ? `WHERE ${element} = ?` : ` AND ${element} = ?`;
                    conditionValues.push(condition[element]);
                }
            }
            let sql = `SELECT ${keys} FROM ${table} ${conditionQuery} LIMIT 1`;
            commonServices.loggerMessage(req, "readSingleData", sql, conditionValues);
            let result = await db.query(sql, conditionValues);

            return result;
        } catch (error) {
            throw new dbError("Database error", error);
        } finally {
            await db.close();
        }
    },
    readAllData: async (req, table, keys, condition = {}, sortBy = null, sortOrder = null) => {
        const db = makeDb(config);
        try {
            let conditionQuery = "";
            let conditionValues = [];
            for (let element in condition) {
                if (Array.isArray(condition[element])) {
                    conditionQuery += conditionQuery == "" ? `WHERE ${element} IN(?)` : ` AND ${element} IN(?)`;
                } else {
                    conditionQuery += conditionQuery == "" ? `WHERE ${element} = ?` : ` AND ${element} = ?`;
                }
                conditionValues.push(condition[element]);
            }
            let sql = `SELECT ${keys} FROM ${table} ${conditionQuery}`;
            if (['power', 'lens_axis_name', 'lens_index_name'].includes(sortBy) && sortOrder) {
                sql += ` ORDER BY CAST(${sortBy} AS FLOAT) ${sortOrder}`
            } else if (sortBy && sortOrder) {
                sql += ` ORDER BY ${sortBy} ${sortOrder}`
            }
            commonServices.loggerMessage(req, "readAllData", sql, conditionValues);

            return await db.query(sql, conditionValues);
        } catch (error) {
            throw new dbError("Database error", error);
        } finally {
            await db.close();
        }
    },
    // For inserting data dynamically
    dynamicInsert: async (req, table, userDetail) => {
        const db = makeDb(config);
        try {
            const capitalizedValues = Object.values(userDetail).map(value => helpers.CM.capitalizeFirstLetter(value));
            const bindStr = Object.keys(userDetail).map(item => '?');
            const sql = `INSERT INTO ${table}(${Object.keys(userDetail).toString()}) VALUES (${bindStr.join(',')})`;

            commonServices.loggerMessage(req, "dynamicInsert", sql, [capitalizedValues]);

            return await db.query(sql, capitalizedValues);
        } catch (error) {
            throw new dbError("Database error", error);
        } finally {
            await db.close();
        }
    },

    // For updating data dynamically
    dynamicUpdate: async (req, table, keys, condition) => {
        db = makeDb(config);
        try {
            let conditionQuery = "";
            let conditionValues = [];
            let keysQuery = "";
            for (let obj in keys) {
                const capitalizedValue = helpers.CM.capitalizeFirstLetter(keys[obj]);
                keys[obj] = capitalizedValue
                keysQuery += keysQuery == "" ? `${obj} = ?` : `,${obj} = ?`;
                conditionValues.push(keys[obj]);
            }
            for (let element in condition) {
                conditionQuery += conditionQuery == "" ? `WHERE ${element} = ?` : ` AND ${element} = ?`;
                conditionValues.push(condition[element]);
            }
            let sql = ` update ${table} SET ${keysQuery} ${conditionQuery} `
            commonServices.loggerMessage(req, "dynamicUpdate", sql, conditionValues);

            return await db.query(sql, conditionValues)
        } catch (error) {
            throw new dbError("Database error", error);
        } finally {
            await db.close();
        }
    },
    dynamicDelete: async (req, table, condition) => {
        const db = makeDb(config);
        try {
            let conditionQuery = "";
            let conditionValues = [];
            for (let element in condition) {
                if (Array.isArray(condition[element])) {
                    conditionQuery += conditionQuery == "" ? `WHERE ${element} IN(?)` : ` AND ${element} IN(?)`;
                } else {
                    conditionQuery += conditionQuery == "" ? `WHERE ${element} = ?` : ` AND ${element} = ?`;
                }
                conditionValues.push(condition[element]);
            }
            let sql = `DELETE FROM ${table} ${conditionQuery}`
            commonServices.loggerMessage(req, "dynamicDelete", sql, conditionValues);
            return await db.query(sql, conditionValues);
        } catch (error) {
            throw new dbError("Database error", error);
        } finally {
            await db.close();
        }
    },
    getAllData: async (req, table, keys, condition, limit, offset, valueSearch = {}, sortBy = null, sortOrder = null) => {
        const db = makeDb(config);

        try {
            let conditionQuery = "";
            let conditionValues = [];

            for (let element in condition) {
                if (Array.isArray(condition[element])) {
                    conditionQuery += conditionQuery === "" ? `${element} IN(?)` : ` AND ${element} IN(?)`;
                } else {
                    conditionQuery += conditionQuery === "" ? `${element} = ?` : ` AND ${element} = ?`;
                }
                conditionValues.push(condition[element]);
            }

            for (let element in valueSearch) {
                if (element === 'createdFrom' && valueSearch[element]) {
                    conditionQuery += conditionQuery === "" ? `created_at >= '${valueSearch[element]} 00:00:00'` : ` AND created_at >= '${valueSearch[element]} 00:00:00'`;
                } else if (element === 'createdTo' && valueSearch[element]) {
                    conditionQuery += conditionQuery === "" ? `created_at <= '${valueSearch[element]} 23:59:59'` : ` AND created_at <= '${valueSearch[element]} 23:59:59'`;
                } else if (element === 'updatedFrom' && valueSearch[element]) {
                    conditionQuery += conditionQuery === "" ? `updated_at >= '${valueSearch[element]} 00:00:00'` : ` AND updated_at >= '${valueSearch[element]} 00:00:00'`;
                } else if (element === 'updatedTo' && valueSearch[element]) {
                    conditionQuery += conditionQuery === "" ? `updated_at <= '${valueSearch[element]} 23:59:59'` : ` AND updated_at <= '${valueSearch[element]} 23:59:59'`;
                } else if (valueSearch[element]) {
                    conditionQuery += conditionQuery === "" ? `${element} LIKE ?` : ` AND ${element} LIKE ?`;
                    conditionValues.push('%' + valueSearch[element] + '%');
                }
            }

            let whereClause = conditionQuery ? `WHERE ${conditionQuery}` : '';

            let sql = `SELECT ${keys} FROM ${table} ${whereClause}`;
            if (['power', 'lens_axis_name', 'lens_index_name'].includes(sortBy) && sortOrder) {
                sql += ` ORDER BY CAST(${sortBy} AS FLOAT) ${sortOrder}`
            } else if (sortBy && sortOrder) {
                sql += ` ORDER BY ${sortBy} ${sortOrder}`;
            }
            if (limit >= 1 && limit != null && offset >= 0 && offset != null) {
                sql += ` LIMIT ${limit} OFFSET ${offset}`;
            }

            commonServices.loggerMessage(req, "getAllDataWithPageSize&pageNo", sql, conditionValues);
            let result = await db.query(sql, conditionValues);
            return result;
        } catch (error) {
            throw new dbError("Database error", error);
        } finally {
            await db.close();
        }
    },
    getLastItem: async (req, table) => {
        const db = makeDb(config);
        try {
            let sql = `SELECT * FROM ${table} ORDER BY id DESC LIMIT 1`
            commonServices.loggerMessage(req, "getLastOrder", sql);
            let result = await db.query(sql);
            return result;
        } catch (error) {
            throw new dbError("Database error", error);
        } finally {
            await db.close();
        }
    },
    loggerMessage: (req, functionName, sql, data) => {
        let userId = "";
        let api = req.url;
        if (req.token) {
            userId = req.token.userId;
        }
        eventLogger.info(`\n API:${api}, USERID:${userId}, FUNCTION:${functionName}, PARAMETERS:(${JSON.stringify(data)}), QUERY:${sql}`);
    },

    createTransactionId: async (req) => {
        try {
            function addZerosToBeginningOfTransaction(inputString, numberOfZeros) {
                return 'TNX_' + '0'.repeat(numberOfZeros) + inputString;
            }
            let transaction = await commonServices.getLastItem(req, con.TN.TRANSACTIONHISTORY)
            let transactionId = "TNX_0000000001"
            if (transaction.length != 0) {
                transactionId = addZerosToBeginningOfTransaction(transaction[0].id + 1, 10 - (transaction[0].id + 1).toString().length);
            }
            return transactionId
        } catch (error) {
            throw new customError(error.message);
        }
    },
}
module.exports = commonServices;