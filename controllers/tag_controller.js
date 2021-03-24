var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var tagModel = require('../models/tag');
var boardTagModel = require('../models/board_tag');
var DataTypes = require('sequelize/lib/data-types');

exports.getTag = function(t_name){
    return new Promise(function(resolve, reject){
        findOrCreateTag(t_name).then(tag => {
            resolve(tag);
        }, function (err) {
            console.log("Error ocurred: " + err);
            reject(err);
        });
    });
};

exports.postTagOfBoard = function(b_id, t_name){
    
    return new Promise(function(resolve,reject) {
        var BoardTagModel = boardTagModel(sequelize, DataTypes);
        var success = true;
        findOrCreateTag(t_name).then( tag => {
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
        });
        resolve(success);
    });
}

findOrCreateTag = function(t_name){
    var TagModel = tagModel(sequelize, DataTypes);
    var tag = await TagModel.findOrCreate({ where : { tagName: t_name} })
    return tag;    
}