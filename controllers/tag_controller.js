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

exports.getBoardTags = function(board){
    return new Promise(function(resolve, reject){
        var BoardTagModel = boardTagModel(sequelize, DataTypes);
        var TagModel = tagModel(sequelize, DataTypes);

        var tagList = [];
        var tagPromises= []

        BoardTagModel.findAll({where: {boardId: board.id }}).then(boardTags =>{
            boardTags.forEach(boardTag => {
                TagModel.findOne({where:{id: boardTag.tagId}}).then( tag =>{
                    console.log("________________________")
                    console.log(tag.tagName)
                    console.log("________________________")
                },function(err){
                    reject("Mysql error, check your query"+err);
                });
            },function(err){
                reject("Mysql error, check your query"+err);
            });
            console.log()
        })

        Promise.all(tagPromises).then(tags =>{
            tags.forEach(tag =>{
                tagList.push(tag.tagName)
            })
        },function(err){
            reject("Mysql error, check your query"+err);
        })
        
        resolve(tagList);
    });
};

exports.postTagOfBoard = function(b_id, tag){
    
    return new Promise(function(resolve,reject) {
        var BoardTagModel = boardTagModel(sequelize, DataTypes);
        
        BoardTagModel.create({
            tagId : tag.id,
            boardId : b_id,
        }).then(boardTag => {
            console.log("Board-Tag created");
            resolve(boardTag);
        }, function (err) {
            console.log("Error ocurred: " + err);
            reject(err);
        }); 
    });
}