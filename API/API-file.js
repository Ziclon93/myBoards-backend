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
async function asyncCheckAPIKey(req, res, next) {
    try {
        var result = await ctl_user.getUserByAPIKey(req.headers['api-key']);
        if (result) {
            next();
        }
        else {
            res.send("No valid API key");
        }
    }
    catch (err) {
        res.send("No valid API key");
    }
}

router.post('/signup', function (req, res, next) {
    ctl_user.signUp(req.body['email'], req.body['username'], req.body['password'])
        .then(user => {
            if (user) {
                res.json({
                    apiKey: user.apiKey,
                })
            } else {
                throw error;
            }
        }).catch((err) => {
            console.log("Login Rejected", err);
            res.statusCode = 500;
            res.end("The user is already registered");
        });;
});

router.post('/login', function (req, res, next) {

    ctl_user.userController_Login(req.body['username'], req.body['password'])
        .then(user => {
            if (user) {
                res.json({
                    apiKey: user.apiKey,
                });
            } else {
                throw Error("User Not valid")
            }
        }).catch((err) => {
            console.log("Login Rejected", err);
            res.statusCode = 500;
            res.end("User not valid");
        });
});

router.get('/boards', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(function (user) {
        ctl_board.getAllBoards().then(boards => {
            if (boards) {
                var resultList = [];
                var promiseList = [];
                boards.forEach(board => {
                    promiseList.push(getBoardData(user, board));
                });
                Promise.all(promiseList).then(boardDataList => {
                    boardDataList.forEach(boardData => {
                        resultList.push(boardData);
                    });
                    res.json(resultList);
                })
            }
            else {
                res.json({
                    success: false,
                })
            }
        }, function (err) {
            console.log(err);
            res.statusCode = 500;
            res.end("Get Board rejected");
        });
    }, function (err) {
        console.log("Create post Rejected", err);
        res.status(500).send("No valid API key");
    });
});

router.post('/board', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(function (user) {
        ctl_board.postBoard(
            user,
            req.body['title'],
            req.body['tags'],
            req.body['iconUrl']
        )
            .then(function (board) {
                res.json({
                    id: board.id,
                    title: board.title,
                    tags: req.body['tags'],
                    iconUrl: board.iconUrl,
                    valoration: 0.0,
                    posts: []
                })
            }).catch((err) => {
                console.log("Post board", err);
                res.statusCode = 500;
                res.end(err);
            });
    });
});

router.post('/boards/follower', asyncCheckAPIKey, function (req, res, next) {
    ctl_board.getFollowerBoards(req.body['followed_name']).then(boards => {
        if (boards) {
            var list = [];
            for (i in boards) {
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
        else {
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
            if (success) {
                res.json({
                    success: true,
                })
            } else {
                res.json({
                    success: false,
                })
            }
        }, function (err) {
            console.log("Follow Rejected", err);
            res.status(500).send("Internal server error");
        });
    }, function (err) {
        console.log("Follow Rejected", err);
        res.status(500).send("Internal server error");
    });
});

router.post('/board/post', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        ctl_post.postPost(
            user,
            req.body['boardId'],
            req.body['resourceUrl']
        ).then(post => {
            ctl_valoration.getPostValoration(post).then(valoration => {
                ctl_valoration.getUserLikeCode(user, post).then(likeCode => {
                    res.json({
                        id: post.id,
                        x: post.x,
                        y: post.y,
                        rotation: post.rotation,
                        resourceUrl: post.resourceUrl,
                        valoration: valoration,
                        userLikeCode: likeCode,
                    })
                }), function (err) {
                    console.log("Create post Rejected", err);
                    res.status(500).send("Create post Rejected", err);
                }
            }), function (err) {
                console.log("Create post Rejected", err);
                res.status(500).send("Create post Rejected", err);
            }
        }, function (err) {
            console.log("Create post Rejected", err);
            res.status(500).send("Create post Rejected", err);
        });

    }, function (err) {
        console.log("Create post Rejected", err);
        res.status(500).send("No valid API key");
    });
});

router.post('/board/post/like', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        ctl_valoration.likePost(user.id, req.body['postId']).then(likeResult => {
            res.status(200).send("Like Success")
        }, function (err) {
            console.log("Like Rejected", err);
            res.status(500).send("Like rejected");
        })
    }, function (err) {
        console.log("Like Rejected", err);
        res.status(500).send("No valid API key");
    });
});


router.post('/board/post/dislike', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        ctl_valoration.dislikePost(user.id, req.body['postId']).then(dislikeResult => {
            res.status(200).send("Dislike success")
        }, function (err) {
            console.log("Dislike Rejected", err);
            res.status(500).send("Dislike rejected");
        })
    }, function (err) {
        console.log("Like Rejected", err);
        res.status(500).send("No valid API key");
    });
});

router.post('/profile/iconUrl', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        ctl_user.setIconUrl(user.id, req.body['iconUrl']).then(new_iconUrl => {
            res.json({
                iconUrl: new_iconUrl,
            })
        }, function (err) {
            console.log("iconUrl update rejected", err);
            res.statusCode = 500;
            res.end("iconUrl update rejected");
        });
    }, function (err) {
        console.log("iconUrl update rejected", err);
        res.statusCode = 500;
        res.end("iconUrl update rejected");
    });
});

router.get('/profile/boards', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(function (user) {
        ctl_board.getUserBoards(user).then(boards => {
            if (boards) {
                var resultList = [];
                var promiseList = [];
                boards.forEach(board => {
                    promiseList.push(getBoardData(user, board));
                });
                Promise.all(promiseList).then(boardDataList => {
                    boardDataList.forEach(boardData => {
                        resultList.push(boardData);
                    });
                    res.json(resultList);
                })
            }
            else {
                res.json({
                    success: false,
                })
            }
        }, function (err) {
            console.log(err);
            res.statusCode = 500;
            res.end("Get Board rejected");
        });
    }, function (err) {
        console.log("Create post Rejected", err);
        res.status(500).send("No valid API key");
    });
});

router.post('/users/category', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        ctl_user.setCategory(req.body['user_id'], req.body['category']).then(success => {
            if (success) {
                res.json({
                    success: true,
                })
            } else {
                res.json({
                    success: false,
                })
            }
        }, function (err) {
            console.log("Category edit Rejected", err);
            res.status(500).send("Internal server error");
        });
    }, function (err) {
        console.log("Category edit Rejected", err);
        res.status(500).send("Internal server error");
    });
});

router.get('/profile', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        ctl_valoration.getUserValoration(user).then(valoration => {
            res.json({
                username: user.username,
                iconUrl: user.iconUrl,
                valoration: valoration,
            });
        }, function (err) {
            console.log("Get profile Rejected", err);
            res.status(500).send("Internal server error");
        })
    }, function (err) {
        console.log("Get profile Rejected", err);
        res.status(500).send("Internal server error");
    });
});


router.get('/tags/boards', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {

        ctl_tag.getMostUsedTags().then(tags => {
            var listBoardPromises = []
            tags.forEach(tag => {
                listBoardPromises.push(ctl_board.getBoardsOfTag(tag));
            });
            Promise.all(listBoardPromises).then(boardLists => {

                var listBoardDataPromises = []
                boardLists.forEach(board => {
                    listBoardDataPromises.push(getBoardData(user, board));
                });
                Promise.all(listBoardPromises).then(boardDataLists => {
                    var finalList = []
                    tags.forEach((tag, index) => {
                        finalList.push({
                            tagName: tag.tagName,
                            boardList: boardDataLists[index],
                        });
                    });
                    res.json(finalList);
                }, function (err) {
                    console.log("Get Board rejected", err);
                    res.status(500).send("Internal server error");
                });
            }, function (err) {
                console.log("Get Board rejected", err);
                res.status(500).send("Internal server error");
            });
        }, function (err) {
            console.log("Get Board rejected", err);
            res.status(500).send("Internal server error");
        });
    }, function (err) {
        console.log("Create post Rejected", err);
        res.status(500).send("No valid API key");
    });
});

router.get('/board', asyncCheckAPIKey, function (req, res, next) {
    ctl_user.getUserByAPIKey(req.headers['api-key']).then(user => {
        ctl_board.getBoardById(req.query['boardId']).then(board => {
            getBoardData(user, board).then(boardData => {
                res.json(boardData);
            });
        }, function (err) {
            console.log("Get Board rejected", err);
            res.status(500).send("Internal server error");
        });
    }, function (err) {
        console.log("Get profile Rejected", err);
        res.status(500).send("Internal server error");
    });
});

function getBoardData(user, board) {
    return new Promise(function (resolve, reject) {

        var dataPromises = [];
        dataPromises.push(ctl_tag.getBoardTags(board));
        dataPromises.push(ctl_valoration.getBoardValoration(board));
        dataPromises.push(ctl_post.getBoardPosts(board));
        Promise.all(dataPromises).then(promisesResults => {
            var postValorationPromises = [];
            var postLikeCodePromises = [];
            promisesResults[2].forEach(post => {
                postValorationPromises.push(ctl_valoration.getPostValoration(post));
                postLikeCodePromises.push(ctl_valoration.getUserLikeCode(user, post))
            })
            Promise.all(postValorationPromises).then(valorations => {
                Promise.all(postLikeCodePromises).then(likeCodes => {
                    var postList = [];
                    valorations.forEach((valoration, index) => {
                        postList.push(
                            {
                                id: promisesResults[2][index].id,
                                x: promisesResults[2][index].x,
                                y: promisesResults[2][index].y,
                                rotation: promisesResults[2][index].rotation,
                                resourceUrl: promisesResults[2][index].resourceUrl,
                                valoration: valoration,
                                userLikeCode: likeCodes[index],
                            }
                        );
                    });
                    resolve({
                        id: board.id,
                        title: board.title,
                        tags: promisesResults[0],
                        iconUrl: board.iconUrl,
                        valoration: promisesResults[1],
                        postList: postList
                    });
                }, function (err) {
                    reject("Get Board rejected" + err);
                });
            }, function (err) {
                reject("Get Board rejected" + err);
            });
        }, function (err) {
            reject("Get Board rejected" + err);
        });
    });
}

module.exports = router;