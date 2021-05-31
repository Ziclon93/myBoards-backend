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
            console.log("____________________________")
            console.log(tagResult)
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
                tagPromises.push(TagModel.findOne({where:{id: boardTag.tagId}}))
            },function(err){
                reject("Mysql error, check your query"+err);
            });
            console.log()
        })

        console.log("________________________")
        Promise.all(tagPromises).then(tags =>{
            console.log(tag.tagName)
            tagList.push(tag.tagName)
        },function(err){
            reject("Mysql error, check your query"+err);
        })
        console.log("________________________")
        
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