var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var tagModel = require('../models/tag');
var boardTagModel = require('../models/board_tag');
var DataTypes = require('sequelize/lib/data-types');

exports.getTag = function (t_name) {
    return new Promise(function (resolve, reject) {
        var TagModel = tagModel(sequelize, DataTypes);
        TagModel.findOrCreate({ where: { tagName: t_name } })
            .spread(function (tagResult, created) {
                resolve(tagResult);
            });
    });
};

exports.getTagById = function (t_id) {
    return new Promise(function (resolve, reject) {
        var TagModel = tagModel(sequelize, DataTypes);
        TagModel.findOne({ where: { id: t_id } }).then(tag => {
            resolve(tag);
        }, function (err) {
            reject("Mysql error, check your query" + err);
        });
    });
};

exports.getBoardTags = function (board) {
    return new Promise(function (resolve, reject) {
        var BoardTagModel = boardTagModel(sequelize, DataTypes);

        var tagList = [];
        var tagPromises = []

        BoardTagModel.findAll({ where: { boardId: board.id } }).then(boardTags => {
            boardTags.forEach(boardTag => {
                tagPromises.push(exports.getTagById(boardTag.tagId));
            }, function (err) {
                reject("Mysql error, check your query" + err);
            });
            Promise.all(tagPromises).then(tags => {
                tags.forEach(tag => {
                    tagList.push(tag.tagName)
                })
                resolve(tagList);
            }, function (err) {
                reject("Mysql error, check your query" + err);
            })
        })



    });
};
exports.getMostUsedTags = function () {
    return new Promise(function (resolve, reject) {
        var BoardTagModel = boardTagModel(sequelize, DataTypes);
        var TagModel = tagModel(sequelize, DataTypes);

        TagModel.findAll().then(tagList => {
            var tagListQueries = [];
            var touples = [];
            var resultList = [];

            tagList.forEach(tag => {
                tagListQueries.push(BoardTagModel.count({ where: { tagId: tag.id } }))
            })
            Promise.all(tagListQueries).then(tagListQueriesResult => {
                tagListQueriesResult.forEach((count, index) => {
                    touples.push([index, count]);
                })
                touples.sort((first, second) => { return second[1] - first[1] });
                if (touples.length >= 1) {
                    resultList.push(tagList[touples[0][0]])
                    if (touples.length >= 2) {
                        resultList.push(tagList[touples[1][0]])
                    }
                }
                resolve(resultList)
            }, function (err) {
                reject("Mysql error, check your query" + err);
            });
        }, function (err) {
            reject("Mysql error, check your query" + err);
        });
    });
};

/*
exports.getMostUsedTagsBoards = function () {

    return new Promise(function (resolve, reject) {

        var BoardTagModel = boardTagModel(sequelize, DataTypes);
        var TagModel = tagModel(sequelize, DataTypes);

        TagModel.findAll().then(tagList => {
            var tagListQueries = [];
            var touples = [];

            tagList.forEach(tag => {
                tagListQueries.push(BoardTagModel.count({ where: { tagId: tag.id } }))
            })
            Promise.all(tagListQueries).then(tagListQueriesResult => {
                tagListQueriesResult.forEach((count, index) => {
                    touples.push([index, count]);
                })
                touples.sort((first, second) => { return second[1] - first[1] });
                if (touples.length == 0) {
                    resolve([])
                } else {
                    var getTagBoardsPromise = [];
                    console.log("_________________" + tagList[touples[0][0]].id + "___________________");
                    getTagBoardsPromise.push(geBoardsOfTag(tagList[touples[0][0]].id));
                    if (touples.length >= 2) {
                        console.log("_________________" + tagList[touples[1][0]].id + "___________________");
                        getTagBoardsPromise.push(geBoardsOfTag(tagList[touples[1][0]].id));
                    }

                    Promise.all(getTagBoardsPromise).then(boardListsResult => {
                        resolve([boardListsResult[0], boardListsResult[1]]);
                    }, function (err) {
                        reject("Mysql error, check your query" + err);
                    });
                }
            }, function (err) {
                reject("Mysql error, check your query" + err);
            });
        }, function (err) {
            reject("Mysql error, check your query" + err);
        });

    });
}
*/

exports.postTagOfBoard = function (b_id, tag) {

    return new Promise(function (resolve, reject) {
        var BoardTagModel = boardTagModel(sequelize, DataTypes);

        BoardTagModel.create({
            tagId: tag.id,
            boardId: b_id,
        }).then(boardTag => {
            console.log("Board-Tag created");
            resolve(boardTag);
        }, function (err) {
            console.log("Error ocurred: " + err);
            reject(err);
        });
    });
}