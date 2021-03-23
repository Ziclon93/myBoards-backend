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

exports.postBoard = function( user, b_title, b_description, b_type) {

    return new Promise(function(resolve,reject) {
        const Board = boardModel(sequelize, DataTypes);
        var success = true;
        if (user){
            //Check if the content or the title of the thread are not empty
            if(!(t_title.replace(/\s/g, ""))){
                resolve(!success);
            }
            else {
                //With this id, the title and the text we create the model to the database.
                Board.create({
                    userId : user['id'],
                    title: b_title,
                    description: b_description,
                    type: b_type,
                }).then(board => {
                    console.log("Board created");
                    resolve( board);
                });
            }
        }
        else{
            resolve(!success);
        }
    });
};