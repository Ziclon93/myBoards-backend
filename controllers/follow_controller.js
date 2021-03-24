var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var followModel = require('../models/follow');
var DataTypes = require('sequelize/lib/data-types');
var ctl_user = require('../controllers/user_controller');

exports.postFollow = function(user, f_name){
    
    return new Promise(function(resolve,reject) {
        var FollowModel = followModel(sequelize, DataTypes);

        var success = true;
        var followerId = user['id'];
        var followedId = ctl_user.getUserByUsername(f_name)['id'];

        if(existingFollow(followerId, followedId)){
            resolve(!success);
        }else{
            FollowModel.create({
                followerId: followerId,
                followedId: followedId
            }).then(follow => {
                console.log("Follow created");
            }, function (err) {
                console.log("Error ocurred: " + err);
                reject(err);
            }); 
            resolve(success);
        }
    });
}

function existingFollow(followerId, followedId) {
    var FollowModel = followModel(sequelize, DataTypes);
    FollowModel.findOne({ where : { followerId: followerId, followedId: followedId } })
        .then(function(user){
            if(user) {
                return false;
            }
            else {
                return true;
            }
        },function(err){
            reject("Mysql error, check your query"+err);
        });
  }