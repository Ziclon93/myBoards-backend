const express = require('express');
var router = express.Router();
var ctl_user = require('../controllers/user_controller');
var ctl_board = require('../controllers/board_controller');

//Middleware to check API key
async function asyncCheckAPIKey(req,res,next){
    try{
        var result = await ctl_user.getUserByAPIKey(req.headers['api-key'] );
        if (result){
            next();
        }
        else{
            res.send("La API key no es valida");
        }
    }
    catch(err) {
        res.send("La API key no es valida");
    }
}

/* Content-Type : application/x-www-form-urlencoded
 *
 * As x-www-form-urlencoded data we have 3 keys:
 * username
 * email
 * password
 *
 * Return: True (if signed up) False (user already signed up)
 */
router.post('/signup', function (req, res, next) {
    ctl_user.userController_Signup(req.body['email'], req.body['username'], req.body['password'])
        .then(function(success){
            if(success){
                res.json({
                    success: true,
                })
            }else {
                res.json({
                    success: false,
                })
            }
        }, function (err) {
            console.log(err);
            res.status(500).send("Internal server error");
        });
});

/* Content-Type : application/x-www-form-urlencoded
 *
 * As x-www-form-urlencoded data we have 2 keys:
 * username
 * password
 *
 * Return: True (if comment created) False (can not create comment)
 */
router.post('/login', function (req, res, next) {

    ctl_user.userController_Login(req.body['username'], req.body['password'])
        .then((success)=> {
            if(success){
                console.log(success.apiKey)
                res.json({
                    apiKey: success.apiKey,
                    success: true,
                });
            } else {
                res.json({
                    success: false,
                });
            }
        }).catch((err) =>{
            console.log("Login Rejected",err);
            res.status(500).send("Internal server error" , err);
        });
});



router.get('/boards', asyncCheckAPIKey, function (req, res, next) {
    ctl_board.getAllBoards().then(boards => {
        if(boards){
            var list= [];
            for (i in boards){
                var elem = {
                    id: boards[i].id,
                    description: boards[i].description,
                    title: boards[i].title,
                    likes: boards[i].likes,
                    type: boards[i].type,
                    userId: boards[i].userId,
                    createdAt: boards[i].createdAt,
                    updatedAt: boards[i].updatedAt,
                };
                list.push(elem);
            };
            res.json(list);
        }
        else{
            res.json({
                success: false,
            })
        }
    }, function (err) {
        res.status(500).send("Internal server error");
    });
});

module.exports = router;