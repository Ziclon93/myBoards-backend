var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var likeModel = require('../models/like');
var dislikeModel = require('../models/dislike');
var DataTypes = require('sequelize/lib/data-types');
var ctl_board = require('../controllers/board_controller');
var ctl_post = require('../controllers/post_controller');

exports.likePost = function (u_id, p_id) {
    return new Promise(function (resolve, reject) {
        var LikeModel = likeModel(sequelize, DataTypes);
        LikeModel.findOrCreate({ where: { userId: u_id, postId: p_id } })
            .spread(function (likeResult, created) {
                resolve(likeResult);
            }, function (err) {
                reject(err);
            });
    });

}

exports.dislikePost = function (u_id, p_id) {
    return new Promise(function (resolve, reject) {
        var DislikeModel = dislikeModel(sequelize, DataTypes);
        DislikeModel.findOrCreate({ where: { userId: u_id, postId: p_id } })
            .spread(function (dislikeResult) {
                resolve(dislikeResult);
            }, function (err) {
                reject(err);
            });
    });
}

exports.getUserLikeCode = function(user, post){
    return new Promise(function (resolve, reject) {
        var DislikeModel = dislikeModel(sequelize, DataTypes);
        DislikeModel.findOne({ where: { userId: user.id, postId: post.id } })
            .then(dislike => {
                if(dislike){
                    resolve(2);
                }else{
                    var LikeModel = likeModel(sequelize, DataTypes);
                    LikeModel.findOne({ where: { userId:user.id, postId: post.id } })
                    .then(like => {
                        if(like){
                            resolve(1);
                        }else{
                            resolve(0);
                        }
                    }, function (err) {
                        reject(err);
                    });
                }
            }, function (err) {
                reject(err);
            });
    });
}

exports.getUserValoration = function (user) {

    return new Promise(function (resolve, reject) {
        var valorationPromises = [];

        ctl_post.getUserPosts(user).then(userPostList => {

            userPostList.forEach(post => {
                valorationPromises.push(exports.getPostValoration(post));

            });
            ctl_board.getUserBoards(user).then(boardList => {
                boardList.forEach(board => {
                    valorationPromises.push(exports.getBoardValoration(board));
                });

                Promise.all(valorationPromises).then(valorationList => {
                    finalValoration = 0;
                    valorationList.forEach(valoration => {
                        finalValoration += valoration;
                    });

                    resolve(finalValoration);
                }, function (err) {
                    reject(err);
                })
            }, function (err) {
                reject(err);
            })
        }, function (err) {
            reject(err);
        });
    });
}

exports.getBoardValoration = function (board) {

    return new Promise(function (resolve, reject) {

        ctl_post.getBoardPosts(board).then(postList => {
            var postValorationPromises = [];
            postList.forEach(post => {
                postValorationPromises.push(exports.getPostValoration(post));
            });


            Promise.all(postValorationPromises).then(valorations => {
                var finalValoration = 0;
                valorations.forEach(valoration => {
                    finalValoration += valoration;
                });
                resolve(finalValoration)
            }, function (err) {
                reject(err);
            })
        }, function (err) {
            reject(err);
        })
    });
}

exports.getPostValoration = function (post) {
    return new Promise(function (resolve, reject) {
        var LikeModel = likeModel(sequelize, DataTypes);
        var DislikeModel = dislikeModel(sequelize, DataTypes);

        LikeModel.count({ where: { postId: post.id } }).then(postLikes => {
            DislikeModel.count({ where: { postId: post.id } }).then(postDislikes => {
                resolve((parseFloat(postLikes) - parseFloat(postDislikes)) / 100);
            }, function (err) {
                reject(err);
            })
        }, function (err) {
            reject(err);
        });

    });
}