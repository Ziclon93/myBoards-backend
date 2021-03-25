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
        ctl_user.getUserByUsername(f_name).then( followed =>{
            existingFollow(u_id, followed['id']).then(function(result) {
                console.log("_______________22")
                if(result){
                    console.log("_______________2")
                    resolve(!success)
                }else{
                    console.log("_______________")
                    FollowModel.create({
                        followerId: u_id,
                        followedId: followed['id']
                    }).then(follow => {
                        console.log("Follow created");
                    }, function (err) {
                        console.log("Error ocurred: " + err);
                        reject(err);
                    }); 
                    console.log("_______________")
                    resolve(success);
                }
            })
        })
    });
}

function existingFollow(u_id, f_id) {
    var FollowModel = followModel(sequelize, DataTypes);
    return FollowModel.findOne({ where : { followerId: u_id, followedId: f_id } })
  }

  