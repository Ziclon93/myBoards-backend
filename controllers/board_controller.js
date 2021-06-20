var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var boardModel = require('../models/board');
var boardTagModel = require('../models/board_tag');
var DataTypes = require('sequelize/lib/data-types');
var ctl_tag = require('../controllers/tag_controller');
var ctl_user = require('../controllers/user_controller');

exports.getAllBoards = function () {
    return new Promise(function (resolve, reject) {
        var BoardModel = boardModel(sequelize, DataTypes);

        BoardModel.findAll({ order: [['createdAt', 'DESC']] })
            .then(function (data) {
                resolve(data);
            }, function (err) {
                console.log("Error ocurred: " + err);
                reject(err);
            });
    });
};

exports.getUserBoards = function (user) {
    return new Promise(function (resolve, reject) {
        var BoardModel = boardModel(sequelize, DataTypes);

        BoardModel.findAll({ where: { userId: user.id } })
            .then(function (data) {
                resolve(data);
            }, function (err) {
                console.log("Error ocurred: " + err);
                reject(err);
            });
    });
};

exports.getBoardById = function (b_id) {
    return new Promise(function (resolve, reject) {
        var BoardModel = boardModel(sequelize, DataTypes);
        BoardModel.findOne({ where: { id: b_id } })
            .then(data => {
                resolve(data);
            }, function (err) {
                console.log("Error ocurred: " + err);
                reject(err);
            });
    });
};

exports.getBoardsOfTag = function(tag) {
    return new Promise(function (resolve, reject) {
        var BoardTagModel = boardTagModel(sequelize, DataTypes);

        BoardTagModel.findAll({ where: { tagId: tag.id } }).then(boardTags => {
            var boardsPromises = [];
            boardTags.forEach(boardTag => {
                boardsPromises.push(exports.getBoardById(boardTag.boardId));
            })
            Promise.all(boardsPromises).then(boardList => {
                resolve(boardList);
            }, function (err) {
                reject("Mysql error, check your query" + err);
            });
        }, function (err) {
            reject("Mysql error, check your query" + err);
        });
    });
}

exports.getFollowerBoards = function (f_name) {
    return new Promise(function (resolve, reject) {
        var BoardModel = boardModel(sequelize, DataTypes);
        var followedId = ctl_user.getUserByUsername(f_name)['id'];

        BoardModel.findAll({ order: [['createdAt', 'DESC']], where: { followedId: followedId } })
            .then(function (data) {
                resolve(data);
            }, function (err) {
                console.log("Error ocurred: " + err);
                reject(err);
            });
    });
};

exports.postBoard = function (user, b_title, b_tags, b_iconUrl) {

    return new Promise(function (resolve, reject) {
        const BoardModel = boardModel(sequelize, DataTypes);

        if (user) {
            if (!b_title || /^\s*$/.test(b_title)) {
                reject(Error("No valid title for board"));
            } else {
                BoardModel.create({
                    userId: user['id'],
                    title: b_title,
                    iconUrl: b_iconUrl,
                }).then(board => {
                    b_tags.forEach(tagName => {
                        ctl_tag.getTag(tagName).then(tag => {
                            ctl_tag.postTagOfBoard(board.id, tag)
                        }, function (err) {
                            reject(err);
                        });
                    });
                    console.log("Board created");
                    resolve(board);
                }, function (err) {
                    reject(err);
                });
            }
        } else {
            reject(Error("Couldnt create board"));
        }
    });
};