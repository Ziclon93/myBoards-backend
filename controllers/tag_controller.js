var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var tagModel = require('../models/tag');
var boardTagModel = require('../models/board_tag');
var DataTypes = require('sequelize/lib/data-types');

exports.getTagByName = function(t_name){
    return new Promise(function(resolve, reject){
        var tag = getTag(t_name);
        if(tag){
            resolve(tag);
        }else{
            reject();
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
        var tag = getTag(t_name)
        BoardTagModel.create({
            tagId : tag.id,
            boardId : b_id,
        }); 
        resolve(success);
    });
}

getTag =  function(t_name){
    var TagModel = tagModel(sequelize, DataTypes);
    TagModel.findOne({ where : { tagName: t_name} })
     .then(function(data){
       return data;
     });
    return null;
}