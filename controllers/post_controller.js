var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var postModel = require('../models/post');
var DataTypes = require('sequelize/lib/data-types');

exports.postPost = function (user, b_id, p_resourceUrl) {

    return new Promise(function (resolve, reject) {
        var PostModel = postModel(sequelize, DataTypes);

        PostModel.create({
            boardId: b_id,
            userId: user.id,
            resourceUrl: p_resourceUrl,
            x: (getRandomIntInclusive(0, 100)) / 100,
            y: (getRandomIntInclusive(0, 100)) / 100,
            rotation: getRandomIntInclusive(0, 360),
        }).then(post => {
            resolve(post)
        }, function (err) {
            console.log("Error ocurred: " + err);
            reject(err);
        });
    }, function (err) {
        console.log("Error ocurred: " + err);
        reject(err);
    });
}

exports.getUserPosts = function (user) {
    return new Promise(function (resolve, reject) {
        var PostModel = postModel(sequelize, DataTypes);

        PostModel.findAll({ where: { userId: user.id } })
            .then(function (data) {
                resolve(data);
            }, function (err) {
                console.log("Error ocurred: " + err);
                reject(err);
            });
    });
};

exports.getBoardPosts = function (board) {
    return new Promise(function (resolve, reject) {
        var PostModel = postModel(sequelize, DataTypes);
        PostModel.findAll({ where: { boardId: board.id } }).then(data => {
            console.log("_______________________________________-1");
                resolve(data);
            }, function (err) {
                console.log("Error ocurred: " + err);
                reject(err);
            });
    });
};

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // max & min both included 
}