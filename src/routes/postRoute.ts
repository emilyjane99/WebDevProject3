import express from "express";
import jwt from 'jsonwebtoken';
import {SECRET_KEY} from "./userRoute";
import {Post} from "../models/Post";
import {postArray} from "../models/Post";

const postRouter = express.Router();

//GET Posts sorted by date created
postRouter.get('/', (req,res,next)=>{
    let sortedArray:Post[]=[];
    if(postArray.length > 0){
      
        for(var i = postArray.length - 1; i >= 0; i--){
            sortedArray.push(postArray[i]);
        }

        res.status(200).send(sortedArray);
    }
    else{
        res.send({message: "No posts"});
    }
});

//Get specific post
postRouter.get('/:postId', (req,res,next)=>{
    let foundPost = false;

    if(postArray.length > 0){
        for(var i = 0; i < postArray.length; i++){
            if(postArray[i].postId === +req.params.postId){
                foundPost = true;
                res.status(200).send(postArray[i]);
            }
        }
    }
    else{
        res.status(404).send({message:'Post does not exist'});
    }
    if(foundPost = false){
        res.status(404).send({message:'Post does not exist'});
    }
});

//Create new post
postRouter.post('/', (req,res,next)=>{
    if(req.headers.authorization){
        try{
            let tokenPayload = jwt.verify(req.headers.authorization.split(' ')[1].toString(), SECRET_KEY) as {userId:string, firstName:string, iat: number, exp:number, sub: string};
            let newPost = new Post(req.body.title, req.body.content, tokenPayload.userId, req.body.headerImage);
            postArray.push(newPost);
            res.status(201).send({message:'New post created'});
        }
        catch(ex){
            res.status(401).send({message: 'Not authorized'});
        }
    }
    else
    {
        res.status(401).send({message: 'Missing authentication header'});
    }
});

postRouter.patch('/:postId', (req,res,next)=>{
    //cannot update postId or dateCreated
    let content = req.body.content;
    let foundPost:Post|null = null;
    let headerImage = req.body.headerImage;
    let currentDate = new Date;
    let validUser = false;

    //authentication header with valid web token
    if(req.headers.authorization){
        try{
            let tokenPayload = jwt.verify(req.headers.authorization.split(' ')[1].toString(), SECRET_KEY) as {userId:string, firstName:string, iat: number, exp:number, sub: string};
                //make sure post exists
                for(let i = 0; i < postArray.length; i++){
                    if(postArray[i].postId === +req.params.postId){
                        //logged-in user must match post author
                        foundPost = postArray[i];
                        if(tokenPayload.userId === postArray[i].userId){
                        //update content and/or header image
                        validUser = true;
                        foundPost.content = content;
                        foundPost.headerImage = headerImage;
                        foundPost.lastUpdatedDate = currentDate;
                        break;
                        }
                    }
                }
                if(foundPost === null)
                {
                    res.status(404).send({message: 'Post was not found'});
                }
                else if(validUser === false){
                    res.status(401).send({message:'Invalid User for this post'});
                }
                {
                    res.status(200).send({message: 'Post updated'});
                }
        }
        catch(ex){
            res.status(401).send({message: 'Not Authorized'});
        }
    }
    else{
        res.status(401).send({message: 'Missing header'})
    }
});

postRouter.delete('/:postId', (req,res,next)=>{
    let foundPost = false;
    let correctUser = false;

    if(req.headers.authorization)
    {
        try
        {
            let tokenPayload = jwt.verify(req.headers.authorization.split(' ')[1].toString(), SECRET_KEY) as {userId:string, firstName:string, iat: number, exp:number, sub: string};
                for(var i = 0; i < postArray.length; i++)
                {
                    if(postArray[i].userId === tokenPayload.userId)
                    {
                        correctUser = true;
                        if(postArray[i].postId === +req.params.postId){
                            foundPost = true;
                            postArray.splice(i,1);
                            res.status(204);
                        break;
                        }
                    }
                }
                
                if(foundPost === false){
                    res.status(404).send({message: 'Post was not found'});
                }
                else{
                    res.status(204).send({message:'Post is deleted'});
                }
        }
        catch (ex) //invalid token
        {
            console.log("Exception")
            console.log(ex);
            res.status(401).send({message: 'Invalid web token'});
        }
    }
    else
    {
        res.status(401).send({message: 'Missing Authentication Header'});
    }
});

export {postRouter};