const express = require('express');
var router = express.Router();
var ctl_user = require('../controllers/user_controller');
var ctl_board = require('../controllers/board_controller');
var ctl_follow = require('../controllers/follow_controller');
var ctl_post = require('../controllers/post_controller');
var ctl_valoration = require('../controllers/valoration_controller');
const e = require('express');

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
    ctl_user.signUp(req.body['email'], req.body['username'], req.body['password'])
        .then(function(success){
            if(success){
                res.json({
                    success: true,
                })
            }else {
                throw error;
            }
        }).catch((err) =>{
            console.log("Login Rejected",err);
            res.statusCode = 500;
            res.end("The user is already registered");
        });;
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
            res.statusCode = 500;
            res.end("User not valid");
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
                    createdAt: boards[i].createdAt,
                    updatedAt: boards[i].updatedAt
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

/* As headers we have:
 * api-key : "Api key provided in the profile"
 * Content-Type : application/x-www-form-urlencoded
 *
 * As x-www-form-urlencoded data we have 2 keys:
 * title
 * text
 */
router.post('/createBoard', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(function(user) {
        ctl_board.postBoard( 
            user, 
            req.body['title'], 
            req.body['description'], 
            req.body['type'],
            req.body['tags']
            )
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
            }).catch((err) =>{
                console.log("Login Rejected",err);
                res.status(500).send("Internal server error" , err);
            });
    });
});

router.post('/boards/follower', asyncCheckAPIKey, function (req, res, next) {
    ctl_board.getFollowerBoards(req.body['followed_name']).then(boards => {
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
                    updatedAt: boards[i].updatedAt
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

router.post('/follow', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        ctl_follow.postFollow(user, req.body['followed_name']).then(success => {
            if(success){
                res.json({
                    success: true,
                })
            }else{
                res.json({
                    success: false,
                })
            }
        }, function (err) {
            console.log("Follow Rejected",err);
            res.status(500).send("Internal server error");
        });
    }, function (err) {
        console.log("Follow Rejected",err);
        res.status(500).send("Internal server error");
    });
});

router.post('/board/post', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        ctl_post.postPost(
            user,
            req.body['board_id'], 
            req.body['post_title'], 
            req.body['post_description'], 
            req.body['post_url']
        ).then(success => {
            if(success){
                res.json({
                    success: true,
                })
            }else{
                res.json({
                    success: false,
                })
            }
        }, function (err) {
            console.log("Follow Rejected",err);
            res.status(500).send("Internal server error");
        });
     }, function (err) {
        console.log("Follow Rejected",err);
        res.status(500).send("Internal server error");
    });
   
});

router.post('/users/category', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        ctl_user.setCategory(req.body['user_id'], req.body['category']).then(success => {
            if(success){
                res.json({
                    success: true,
                })
            }else{
                res.json({
                    success: false,
                })
            }
        }, function (err) {
            console.log("Category edit Rejected",err);
            res.status(500).send("Internal server error");
        });
    }, function (err) {
        console.log("Category edit Rejected",err);
        res.status(500).send("Internal server error");
    });
});

router.get('/profile', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        ctl_valoration.getUserValoration(user).then(valoration =>{
            res.json({
                username: user.username,
                iconUrl: user.iconUrl,
                valoration: valoration,
            })
        }, function (err) {
            console.log("Category edit Rejected",err);
            res.status(500).send("Internal server error");
        })
    }, function (err) {
        console.log("Category edit Rejected",err);
        res.status(500).send("Internal server error");
    });
});

module.exports = router;