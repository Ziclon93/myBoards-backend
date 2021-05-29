var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var likeModel = require('../models/like');
var dislikeModel = require('../models/dislike');
var DataTypes = require('sequelize/lib/data-types');
var ctl_board = require('../controllers/board_controller');
var ctl_post = require('../controllers/post_controller');

exports.getUserValoration = function(user){
    
    return new Promise(function(resolve,reject) {
        var valorationPromises = [];

        ctl_post.getUserPosts(user).then(userPostList =>{
            for(var post in userPostList){
                valorationPromises.push(getPostValoration(post));
            }
           
            ctl_board.getUserBoards(user).then(boardList =>{
                for(var board in boardList){
                    valorationPromises.push( getBoardValoration(board));
                }

                Promise.all(valorationPromises).then(valorationList =>{
                    finalValoration = 0;
                    for(valoration in valorationList){
                        finalValoration += valoration;
                    }

                    resolve(finalValoration);
                },function (err) {
                    reject(err);
                })

            },function (err) {
                reject(err);
            })
        },function (err) {
            reject(err);
        });
    });
}

exports.getBoardValoration = function(board){
    
    return new Promise(function(resolve,reject) {

        var postValoration = 0;
        ctl_post.getBoardPosts(board).then(postList =>{
            for(post in postList){
                getPostValoration(post).then(valoration =>{
                    postValoration += valoration
                },function(err){
                    reject(err);
                })
            }
        },function(err){
            reject(err);
        })
    });
}

exports.getPostValoration = function(post){
    return new Promise(function(resolve,reject) {

        LikeModel.count({where:{postId: post.id}}).then(function(postLikes){
            DislikeModel.count({where:{postId: post.id}}).then(function(postDislikes){
                resolve((postLikes - postDislikes)/100);
            },function(err){
                reject(err);
            })
        },function(err){
            reject(err);
        });

    });
}