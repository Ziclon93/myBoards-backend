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
            /*
            userPos.for(post => {
                console.log("______________________1")
                valorationPromises.push(exports.getPostValoration(post));
                
            });
            */
           
            ctl_board.getUserBoards(user).then(boardList =>{
                boardList.for(board => {
                    console.log(board)
                    valorationPromises.push( exports.getBoardValoration(board));
                    
                });

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
    console.log("______________________3.1")
    
    return new Promise(function(resolve,reject) {
        console.log("______________________3.1")

        ctl_post.getBoardPosts(board).then(postList =>{
            console.log("______________________3")
            var postValorationPromises = [];
            for(post in postList){
                console.log("______________________4")
                postValorationPromises.push(getPostValoration(post))
            }

            Promise.all(postValorationPromises).then(valorations =>{
                var finalValoration = 0;
                for(valoration in valorations){
                    finalValoration +=valorations 
                }
                resolve(finalValoration)
            },function(err){
                reject(err);
            })
        },function(err){
            reject(err);
        })
    });
}

exports.getPostValoration = function(post){
    return new Promise(function(resolve,reject) {

        LikeModel.count({where:{postId: post.id}}).then(postLikes =>{
            DislikeModel.count({where:{postId: post.id}}).then(postDislikes =>{
                resolve((parseFloat(postLikes) - parseFloat(postDislikes))/100);
            },function(err){
                reject(err);
            })
        },function(err){
            reject(err);
        });

    });
}