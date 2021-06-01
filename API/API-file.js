const express = require('express');
var router = express.Router();
var ctl_user = require('../controllers/user_controller');
var ctl_board = require('../controllers/board_controller');
var ctl_follow = require('../controllers/follow_controller');
var ctl_post = require('../controllers/post_controller');
var ctl_valoration = require('../controllers/valoration_controller');
var ctl_tag = require('../controllers/tag_controller');
const e = require('express');
const board = require('../models/board');
const { json } = require('express');

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
            var resultList= [];
            boards.forEach( board=>{
                var boardData = getBoardData(board);
                if(boardData){
                    resultList.push(boardData);
                    console.log("____________:1")
                }else{
                    console.log("____________:2")
                    throw Error("Get all boards rejected")
                }
            });
            console.log("____________:")
            res.json(list);
        }
        else{
            res.json({
                success: false,
            })
        }
    }, function (err) {
        console.log("iconUrl update rejected",err);
        res.statusCode = 500;
        res.end("iconUrl update rejected");
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
            req.body['tags'],
            req.body['iconUrl']
            )
            .then(function(board){
                res.json({
                    id: board.id,
                    title: board.title,
                    tags: req.body['tags'],
                    iconUrl: board.iconUrl,
                    valoration: 0.0,
                    posts: []
                })
            }).catch((err) =>{
                console.log("Post board",err);
                res.statusCode = 500;
                res.end(err);
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

router.post('/profile/iconUrl', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        ctl_user.setIconUrl(user.id, req.body['iconUrl']).then(new_iconUrl => {
            res.json({
                iconUrl: new_iconUrl,
            })
        }, function (err) {
            console.log("iconUrl update rejected",err);
            res.statusCode = 500;
            res.end("iconUrl update rejected");
        });
    }, function (err) {
        console.log("iconUrl update rejected",err);
        res.statusCode = 500;
        res.end("iconUrl update rejected");
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
            console.log("Get profile Rejected",err);
            res.status(500).send("Internal server error");
        })
    }, function (err) {
        console.log("Get profile Rejected",err);
        res.status(500).send("Internal server error");
    });
});

router.get('/getBoard', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        if(user){
            ctl_board.getBoardById(req.query['boardId']).then(board =>{
                var boardData = getBoardData(board);
                if(boardData){
                    res.boardData;
                }else{
                    throw Error("Get board rejected")
                }
            }, function (err) {
                console.log("Get Board rejected",err);
                res.status(500).send("Internal server error");
            })
        }else{
            throw Error("Get Board rejected");
        }
        
    }, function (err) {
        console.log("Get Board rejected",err);
        res.status(500).send("Internal server error");
    });
});

function getBoardData(board){
    var dataPromises = [];
    dataPromises.push(ctl_tag.getBoardTags(board));
    dataPromises.push(ctl_valoration.getBoardValoration(board));
    dataPromises.push(ctl_post.getBoardPosts(board));

    Promise.all(dataPromises).then(promisesResults =>{
        var postValorationPromises = [];
        promisesResults[2].forEach(post =>{
            postValorationPromises.push(ctl_valoration.getPostValoration(post));
        })
        Promise.all(postValorationPromises).then(valorations =>{
            var postList = [];
            valorations.forEach(valoration =>{
                postList.push(
                    json({
                        id: post.id,
                        x: post.x,
                        y: post.y,
                        rotation: post.rotation,
                        resourceUrl: post.resourceUrl,
                        valoration:valoration
                    })
                );
            });
            return json({
                id: board.id,
                title: board.title,
                tags: promisesResults[0],
                iconUrl: board.iconUrl,
                valoration: promisesResults[1],
                postList: postList
            })
        },function(err){
            return json()
        })
    }, function (err) {
        return json()
    });
    return json()
}

module.exports = router;