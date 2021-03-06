var sequelizeConnection = require('../config/sequelizeConnection');
var sequelize = sequelizeConnection.sequelize;
var userModel = require('../models/user');
var DataTypes = require('sequelize/lib/data-types');
const bcrypt = require('bcrypt');
var hat = require('hat');

exports.userController_Signup = function (u_email, u_name, u_pass) {

    return new Promise(function(resolve,reject){
        const saltRounds = 10;
        var UserModel = userModel(sequelize, DataTypes);

        UserModel.findOne({ where : { username: u_name, email:u_email } })
            .then(function(user){
                if(user) {
                    resolve(false);
                }
                else {
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        bcrypt.hash(u_pass, salt, function (err, hash) {
                            //Generamos API key:
                            var apikey = hat();
                            UserModel.create({
                                email: u_email,
                                username: u_name,
                                password: hash,
                                apiKey: apikey,
                                privacity : 0,
                            }).then(user => {
                                console.log("User created and added to sitexml");
                            });
                        });
                    });

                    resolve(true);
                }
            },function(err){
                reject("Mysql error, check your query"+err);
            });
    });
};

exports.userController_Login = function (u_name, u_pass) {
    //retrieve user from database.

    return new Promise(function (resolve, reject) {
        var UserModel = userModel(sequelize, DataTypes);

        UserModel.findOne({where: {username: u_name}})
            .then((user) => {
                bcrypt.compare(u_pass, user.password).then(
                    (result) => {
                        if(result){
                            resolve(user);
                        }else{
                            resolve(null);
                        }
                    });
            }, function (err) {
                console.log("Error ocurred: " + err);
                reject(err);
            });
    });
};

exports.getUserById = function (userId) {

    return new Promise(function (resolve, reject) {
        var UserModel = userModel(sequelize, DataTypes);

        UserModel.find({where: {id: userId}})
            .then(function (user) {
                resolve(user);
            }, function (err) {
                console.log("Error ocurred: " + err);
                reject(err);
            })
    });
};

exports.getUserByUsername = function (u_username) {

    return new Promise(function (resolve, reject) {
        var UserModel = userModel(sequelize, DataTypes);

        UserModel.findOne({where: {username: u_username}})
            .then(function (user) {
                resolve(user);
            }, function (err) {
                console.log("Error ocurred: " + err);
                reject(err);
            })
    });
};

exports.getUserByAPIKey = function(u_APIKey){
    
    return new Promise(function (resolve, reject) {
        var UserModel = userModel(sequelize, DataTypes);

        UserModel.findOne({where: {apiKey: u_APIKey}})
            .then(function (user) {
                resolve(user);
            }, function (err) {
                console.log("Error ocurred: " + err);
                reject(err);
            })
    });

}
