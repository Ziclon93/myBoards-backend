var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var followModel = require('../models/follow');
var DataTypes = require('sequelize/lib/data-types');
var ctl_user = require('./user_controller');

exports.postFollow = function(user, f_name){
    
    return new Promise(function(resolve,reject) {
        var FollowModel = followModel(sequelize, DataTypes);

        var success = true;
        var u_id = user['id'];
        ctl_user.getUserByUsername(f_name).then( user =>{
            if(existingFollow(user['id'], f_id)){
                resolve(!success);
            }else{
                FollowModel.create({
                    followerId: user['id'],
                    followedId: f_id
                }).then(follow => {
                    console.log("Follow created");
                }, function (err) {
                    console.log("Error ocurred: " + err);
                    reject(err);
                }); 
                resolve(success);
            }
        })

      
    });
}

function existingFollow(u_id, f_id) {
    var FollowModel = followModel(sequelize, DataTypes);
    FollowModel.findOne({ where : { followerId: u_id, followedId: f_id } })
        .then(function(user){
            if(user) {
                return false;
            }
            else {
                return true;
            }
        },function(err){
            console.log("Error ocurred: " + err);
        });
  }