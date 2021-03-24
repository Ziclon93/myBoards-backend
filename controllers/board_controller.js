var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var boardModel = require('../models/board');
var DataTypes = require('sequelize/lib/data-types');
var ctl_tag = require('../controllers/tag_controller');
var ctl_user = require('../controllers/user_controller');

exports.getAllBoards = function(){
    return new Promise(function(resolve, reject){
        var BoardModel = boardModel(sequelize, DataTypes);

        BoardModel.findAll({order:[['createdAt', 'DESC']]})
         .then(function(data){
           resolve(data);
         }, function (err) {
            console.log("Error ocurred: " + err);
            reject(err);
        });
    });
};

exports.getFollowerBoards = function(f_name){
    return new Promise(function(resolve, reject){
        var BoardModel = boardModel(sequelize, DataTypes);
        var followedId = ctl_user.getUserByUsername(f_name)['id'];

        BoardModel.findAll({order:[['createdAt', 'DESC']], where : { followedId: followedId}})
         .then(function(data){
           resolve(data);
         }, function (err) {
            console.log("Error ocurred: " + err);
            reject(err);
        });
    });
};

exports.postBoard = function( user, b_title, b_description, b_type, b_tags) {

    return new Promise(function(resolve, reject) {
        const BoardModel = boardModel(sequelize, DataTypes);

        var success = true;
        if (user){
            if(!b_title || /^\s*$/.test(b_title)){
                resolve(!success);
            }
            else {
                BoardModel.create({
                    userId : user['id'],
                    title: b_title,
                    description: b_description,
                    type: b_type,
                }).then(board => {
                    b_tags.forEach(tagName => {
                        ctl_tag.getTag(tagName).then(tag => {
                            ctl_tag.postTagOfBoard(board.id, tag)
                        }).catch((err) =>{
                            console.log("Tag Rejected",err);
                        });
                    });
                    console.log("Board created");
                }, function (err) {
                    console.log("Error ocurred: " + err);
                    reject(err);
                });

                resolve(success);
            }
        }
    });
};