var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var postModel = require('../models/post');
var DataTypes = require('sequelize/lib/data-types');

exports.postPost = function(user, b_id, p_title, p_description, p_url){
    
    return new Promise(function(resolve,reject) {
        var PostModel = postModel(sequelize, DataTypes);
        var success = true;
        
        PostModel.create({
            boardId: b_id,
            title: p_title,
            descripion: p_description,
            userId: user['id'],
            x: getRandomIntInclusive(0,100),
            y: getRandomIntInclusive(0,100),
            rotation: getRandomIntInclusive(0,100),
            resourceUrl: p_url

        }).then(post => {
            console.log("Post created");
        }, function (err) {
            console.log("Error ocurred: " + err);
            reject(err);
        }); 
        resolve(success);
    });
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // max & min both included 
  }