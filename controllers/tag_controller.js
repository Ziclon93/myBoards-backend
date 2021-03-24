var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var tagModel = require('../models/tag');
var boardTagModel = require('../models/board_tag');
var DataTypes = require('sequelize/lib/data-types');

exports.getTag = function(t_name){
    return new Promise(function(resolve, reject){
        var tag = findOrCreateTag(t_name);
        if(tag){
            resolve(tag);
        }else{
            reject(err);
        }
    });
};

exports.postTag = function(t_name){
    
    return new Promise(function(resolve,reject) {
        var TagModel = tagModel(sequelize, DataTypes);
        var success = true;
        TagModel.create({
            tagName : t_name
        }).then(tag => {
            console.log("Board created");
        });
        resolve(success);
    });
};

exports.postTagOfBoard = function(b_id, t_name){
    
    return new Promise(function(resolve,reject) {
        var BoardTagModel = boardTagModel(sequelize, DataTypes);
        var success = true;
        findOrCreateTag(t_name).then(tag =>{
            BoardTagModel.create({
                tagId : tag.id,
                boardId : b_id,
            }).then(boardTag => {
                console.log("Board-Tag created");
            }); 
        });
        resolve(success);
    });
}

findOrCreateTag = function(t_name){
    var TagModel = tagModel(sequelize, DataTypes);
    var tag = TagModel.findOrCreate({ where : { tagName: t_name} })
    return tag;    
}