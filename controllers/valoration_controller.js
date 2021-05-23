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
            var postLikes = LikeModel.count({where:{postId: post.id}});
            var postDislikes = DislikeModel.count({where:{postId: post.id}});
            
            postsValoration += (postLikes - postDislikes)/100;
        }

        var userBoards = ctl_board.getUserBoards(user);

        var boardsValoration = 0;
        for(var board in userBoards){
            var boardLikes = LikeModel.count({where:{boardId: board.id}});
            var boardDislikes = DislikeModel.count({where:{boardId: board.id}});
            
            boardsValoration += (boardLikes - boardDislikes)/100;
        }

        resolve((postsValoration + boardsValoration) /2);
    });
}