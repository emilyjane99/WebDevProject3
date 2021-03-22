"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRoute_1 = require("./userRoute");
const Post_1 = require("../models/Post");
const Post_2 = require("../models/Post");
const postRouter = express_1.default.Router();
exports.postRouter = postRouter;
//GET Posts sorted by date created
postRouter.get('/', (req, res, next) => {
    let sortedArray = [];
    if (Post_2.postArray.length > 0) {
        for (var i = Post_2.postArray.length - 1; i >= 0; i--) {
            sortedArray.push(Post_2.postArray[i]);
        }
        res.status(200).send(sortedArray);
    }
    else {
        res.send({ message: "No posts" });
    }
});
//Get specific post
postRouter.get('/:postId', (req, res, next) => {
    let foundPost = false;
    if (Post_2.postArray.length > 0) {
        for (var i = 0; i < Post_2.postArray.length; i++) {
            if (Post_2.postArray[i].postId === +req.params.postId) {
                foundPost = true;
                res.status(200).send(Post_2.postArray[i]);
            }
        }
    }
    else {
        res.status(404).send({ message: 'Post does not exist' });
    }
    if (foundPost = false) {
        res.status(404).send({ message: 'Post does not exist' });
    }
});
//Create new post
postRouter.post('/', (req, res, next) => {
    if (req.headers.authorization) {
        try {
            let tokenPayload = jsonwebtoken_1.default.verify(req.headers.authorization.split(' ')[1].toString(), userRoute_1.SECRET_KEY);
            let newPost = new Post_1.Post(req.body.title, req.body.content, tokenPayload.userId, req.body.headerImage);
            Post_2.postArray.push(newPost);
            res.status(201).send({ message: 'New post created' });
        }
        catch (ex) {
            res.status(401).send({ message: 'Not authorized' });
        }
    }
    else {
        res.status(401).send({ message: 'Missing authentication header' });
    }
});
postRouter.patch('/:postId', (req, res, next) => {
    //cannot update postId or dateCreated
    let content = req.body.content;
    let foundPost = null;
    let headerImage = req.body.headerImage;
    let currentDate = new Date;
    let validUser = false;
    //authentication header with valid web token
    if (req.headers.authorization) {
        try {
            let tokenPayload = jsonwebtoken_1.default.verify(req.headers.authorization.split(' ')[1].toString(), userRoute_1.SECRET_KEY);
            //make sure post exists
            for (let i = 0; i < Post_2.postArray.length; i++) {
                if (Post_2.postArray[i].postId === +req.params.postId) {
                    //logged-in user must match post author
                    foundPost = Post_2.postArray[i];
                    if (tokenPayload.userId === Post_2.postArray[i].userId) {
                        //update content and/or header image
                        validUser = true;
                        foundPost.content = content;
                        foundPost.headerImage = headerImage;
                        foundPost.lastUpdatedDate = currentDate;
                        break;
                    }
                }
            }
            if (foundPost === null) {
                res.status(404).send({ message: 'Post was not found' });
            }
            else if (validUser === false) {
                res.status(401).send({ message: 'Invalid User for this post' });
            }
            {
                res.status(200).send({ message: 'Post updated' });
            }
        }
        catch (ex) {
            res.status(401).send({ message: 'Not Authorized' });
        }
    }
    else {
        res.status(401).send({ message: 'Missing header' });
    }
});
postRouter.delete('/:postId', (req, res, next) => {
    let foundPost = false;
    let correctUser = false;
    if (req.headers.authorization) {
        try {
            let tokenPayload = jsonwebtoken_1.default.verify(req.headers.authorization.split(' ')[1].toString(), userRoute_1.SECRET_KEY);
            for (var i = 0; i < Post_2.postArray.length; i++) {
                if (Post_2.postArray[i].userId === tokenPayload.userId) {
                    correctUser = true;
                    if (Post_2.postArray[i].postId === +req.params.postId) {
                        foundPost = true;
                        Post_2.postArray.splice(i, 1);
                        res.status(204);
                        break;
                    }
                }
            }
            if (foundPost === false) {
                res.status(404).send({ message: 'Post was not found' });
            }
            else {
                res.status(204).send({ message: 'Post is deleted' });
            }
        }
        catch (ex) //invalid token
         {
            console.log("Exception");
            console.log(ex);
            res.status(401).send({ message: 'Invalid web token' });
        }
    }
    else {
        res.status(401).send({ message: 'Missing Authentication Header' });
    }
});
//# sourceMappingURL=postRoute.js.map