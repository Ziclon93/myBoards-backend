var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var tagModel = require('../models/tag');
var DataTypes = require('sequelize/lib/data-types');

exports.getTag = function(t_name){
    return new Promise(function(resolve, reject){
        var TagModel = tagModel(sequelize, DataTypes);
        TagModel.findOne({ where : { tagName: t_name} })
         .then(function(data){
           resolve(data);
         }, function(err){
           reject(err);
         });
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