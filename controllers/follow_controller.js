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
            var f_id = followed['id'];
            let f_exist = FollowModel.findOne({ where : { followerId: u_id, followedId: f_id } })

            console.log("_______________22")
            if(f_exist){
                console.log("_______________2")
                resolve(!success)
            }else{
                console.log("_______________")
                FollowModel.create({
                    followerId: u_id,
                    followedId: f_id
                }).then(follow => {
                    console.log("Follow created");
                }, function (err) {
                    console.log("Error ocurred: " + err);
                    reject(err);
                }); 
                console.log("_______________")
                resolve(success);
            }
        });
    });
}

  