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
            var tagListResult = [];
            var maxValue = 0;
            tagList.forEach(tag => {
                tagListQueries.push(BoardTagModel.count({ where: { tagId: tag.id } }))
            })
            Promise.all(tagListQueries).then(tagListQueriesResult => {
                tagListQueriesResult.forEach((count, index) => {
                    touples.push([index,count]);
                })
                touples = sorted(touples, key = lambda(x[1]));
                touples.forEach((index, count) =>{
                    print("______________________________");
                    print("index " + index + " count: " + count);
                    print("______________________________");
                })
            })
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