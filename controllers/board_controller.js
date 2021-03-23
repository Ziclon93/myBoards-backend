var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var boardModel = require('../models/board');
var DataTypes = require('sequelize/lib/data-types');

exports.getAllBoards = function(){
    return new Promise(function(resolve, reject){
        var BoardModel = boardModel(sequelize, DataTypes);

        BoardModel.findAll({order:[['likes', 'ASC']]})
         .then(function(data){
           resolve(data);
         }, function(err){
           reject(err);
         });
    });
};

exports.getBoards = function(){
    return new Promise(function(resolve, reject){
        var BoardModel = boardModel(sequelize, DataTypes);

        BoardModel.findAll()
         .then(function(data){
           resolve(data);
         }, function(err){
           reject(err);
         });
    });
};
