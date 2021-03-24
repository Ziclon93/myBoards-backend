var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var tagModel = require('../models/tag');
var boardTagModel = require('../models/board_tag');
var DataTypes = require('sequelize/lib/data-types');

exports.getTag = function(t_name){
    return new Promise(function(resolve, reject){
        
        var TagModel = tagModel(sequelize, DataTypes);
        TagModel.findOrCreate({ where : { tagName: t_name} })
        .spread(function(tagResult, created){
            resolve(tagResult);
        });
    });
};

exports.postTagOfBoard = function(b_id, tag){
    
    return new Promise(function(resolve,reject) {
        var BoardTagModel = boardTagModel(sequelize, DataTypes);
        var success = true;
        
        console.log("__________________");
        console.log("tag.id" + tag.id);
        console.log("tag" + tag);
        console.log("tag[id]" + tag['id']);
        console.log("__________________");
        BoardTagModel.create({
            tagId : tag.id,
            boardId : b_id,
        }).then(boardTag => {
            console.log("Board-Tag created");
        }, function (err) {
            console.log("Error ocurred: " + err);
            reject(err);
        }); 
        resolve(success);
    });
}