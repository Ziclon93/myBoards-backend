var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var boardModel = require('../models/board');
var DataTypes = require('sequelize/lib/data-types');
var ctl_tag = require('../controllers/tag_controller');

exports.getAllBoards = function(){
    return new Promise(function(resolve, reject){
        var BoardModel = boardModel(sequelize, DataTypes);

        BoardModel.findAll({order:[['createdAt', 'DESC']]})
         .then(function(data){
           resolve(data);
         }, function(err){
           reject(err);
         });
    });
};

exports.postBoard = function( user, b_title, b_description, b_type, b_tags) {

    return new Promise(function(resolve,reject) {
        const BoardModel = boardModel(sequelize, DataTypes);

        var success = true;
        if (user){
            if(!b_title || /^\s*$/.test(b_title)){
                resolve(!success);
            }
            else {
                console.log("_________________________");
                BoardModel.create({
                    userId : user['id'],
                    title: b_title,
                    description: b_description,
                    type: b_type,
                }).then(board => {
                    b_tags.forEach(tagName => {
                        if(!ctl_tag.getTag(tagName)){
                            ctl_tag.postTag(tagName);
                        }
                        ctl_tag.postTagOfBoard(board.id, tagName)
                    });
                    console.log("Board created");
                });

                resolve(success);
            }
        }
        else{
            resolve(!success);
        }
    });
};