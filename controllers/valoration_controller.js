var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var likeModel = require('../models/like');
var dislikeModel = require('../models/dislike');
var DataTypes = require('sequelize/lib/data-types');
var ctl_board = require('../controllers/board_controller');
var ctl_post = require('../controllers/post_controller');

exports.getUserValoration = function(user){
    
    return new Promise(function(resolve,reject) {
        var LikeModel = likeModel(sequelize, DataTypes);
        var DislikeModel = dislikeModel(sequelize,DataTypes);

        var userPosts = ctl_post.getUserPosts(user);
        var postsValoration = 0;
        for(var post in userPosts){
            LikeModel.count({where:{postId: post.id}}).then(function(postLikes){
                DislikeModel.count({where:{postId: post.id}}).then(function(postDislikes){
                    postsValoration += (postLikes - postDislikes)/100;
                },function(err){
                    reject("Mysql error, check your query"+err);
                })
            },function(err){
                reject("Mysql error, check your query"+err);
            });
        }

        var userBoards = ctl_board.getUserBoards(user);

        var boardsValoration = 0;
        for(var board in userBoards){
            LikeModel.count({where:{boardId: board.id}}).then(function(boardLikes){
                DislikeModel.count({where:{boardId: board.id}}).then(function(boardDislikes){
                    boardsValoration += (boardLikes - boardDislikes)/100;
                },function(err){
                    reject("Mysql error, check your query"+err);
                })
            },function(err){
                reject("Mysql error, check your query"+err);
            });
            
        }

        resolve((postsValoration + boardsValoration) /2);
    });
}