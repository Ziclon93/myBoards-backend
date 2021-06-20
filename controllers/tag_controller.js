var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var tagModel = require('../models/tag');
var boardTagModel = require('../models/board_tag');
var ctl_board = require('../controllers/board_controller');
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
                } else if (touples.length == 1) {
                    BoardTagModel.findAll({ where: { tagId: tagList[0].id } }).then(boardTags => {
                        var boardsPromises = [];
                        boardTags.forEach(boardTag => {
                            boardsPromises.push(ctl_board.getBoardById(boardTag.boardId));
                        })

                        Promise.all(boardsPromises).then(boardList => {
                            resolve([boardList]);
                        }, function (err) {
                            reject("Mysql error, check your query" + err);
                        });
                    });
                } else {
                    console.log(tagList);
                    BoardTagModel.findAll({ where: { tagId: tagList[0].id } }).then(boardTags1 => {
                        var boardsLists = [];
                        var boardsPromises = [];
                        boardTags1.forEach(boardTag1 => {
                            console.log("____________________________________");
                            console.log(boardTag1.boardId);
                            boardsPromises.push(ctl_board.getBoardById(boardTag1.boardId));
                        })
                        Promise.all(boardsPromises).then(boardList => {
                            boardsLists.push([boardList]);
                            BoardTagModel.findAll({ where: { tagId: tagList[1].id } }).then(boardTags2 => {
                                var boardsPromises = [];
                                boardTags2.forEach(boardTag2 => {
                                    boardsPromises.push(ctl_board.getBoardById(boardTag2.boardId));
                                })
                                Promise.all(boardsPromises).then(boardList => {
                                    boardsLists.push(boardList);
                                    resolve(boardsLists);
                                });
                            }, function (err) {
                                reject("Mysql error, check your query" + err);
                            });
                        }, function (err) {
                            reject("Mysql error, check your query" + err);
                        });
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