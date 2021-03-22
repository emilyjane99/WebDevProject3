//import { urlencoded } from 'body-parser';
import {User} from '../models/User';
import {Post} from '../models/Post';
import {postArray} from '../models/Post';
import jwt from 'jsonwebtoken';
import express from "express";
import bcrypt from 'bcrypt';

const usersRouter = express.Router();
const SECRET_KEY = 'eislnlaegr'
let userArray:User[]=[];

//GET Request on /Users
usersRouter.get('/', (req,res,next)=>{
    res.send(userArray.sort((a,b)=>
    {
        if(a.userId < b.userId){
            return -1;
        }
        else if(a.userId > b.userId){
            return 1;
        }
        else{
            return 0;
        }
    }));
    res.json('{"Status:" 200}');
    //res.status(200);
});

usersRouter.get('/Posts/:userId', (req,res,next)=>{
    let foundUserPosts = false;
    let userPosts:Post[]=[];
    let numOfPosts:number = 0;

    for(let i = 0; i < postArray.length; i++){
        if(postArray[i].userId === req.params.userId){
            foundUserPosts = true;
            userPosts.push(postArray[i]);
            numOfPosts++;
        }
    }

    if(foundUserPosts === false){
       res.send({message: 'User has no posts'});
    }
    else{
        res.status(200).send(userPosts);
    }
});

//GET Request on Users/userId
usersRouter.get('/:userId', (req,res,next)=>{

    for(var i=0; i<userArray.length; i++)
    {
        if(userArray[i].userId === req.params.userId)
        {
            res.status(200).send(userArray[i]);
            return;
        }
    }
    res.status(404).send({message: 'User not found'});
});

//POST Request received on /Users
usersRouter.post('/', (req, res,next)=>{
    //email can have letters (uppercase & lowercase), numbers, . , _ , then an @ letters . letters
    let userExists = false;
    var validEmail = /^[a-zA-Z0-9._]+@[a-zA-Z]+.[a-z]+/;
    
        if(req.body.userId && req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password)
        {
            //check previous users
            for(var i=0; i<userArray.length; i++)
            {
                if(userArray[i].userId === req.body.userId)
                {
                    userExists = true;
                }
            }
            
            if(userExists === false){
                //validate email
                if(validEmail.test(req.body.emailAddress)){
                    //valid email, hash password
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(req.body.password, salt, function(err, hash) {
                            let newUser = new User(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress, hash);
                            userArray.push(newUser);
                            res.status(201).json(newUser);
                        });
                    });
                }
                else{
                    res.status(406).send({message:'Invalid Email Address'});
                }
            }
            else{
                res.status(409).send({message: `UserId already exists`});
            }
        }
        else
        {
            res.status(406).send({message:'userId,firstName,lastName, and emailAddress are all required fields'});
        }
});

usersRouter.patch('/:userId', (req, res, next) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let emailAddress = req.body.emailAddress;
    let foundUser:User|null = null;

    if(req.headers.authorization){
        try{
            let tokenPayload = jwt.verify(req.headers.authorization.split(' ')[1].toString(), SECRET_KEY) as {userId:string, firstName:string, iat: number, exp:number, sub: string};
            if(tokenPayload.userId === req.params.userId){
                for(let i = 0; i < userArray.length; i++){
                    if(userArray[i].userId === req.params.userId){
                        foundUser = userArray[i];
                        foundUser.firstName = firstName;
                        foundUser.lastName = lastName;
                        foundUser.emailAddress = emailAddress;
                        break;
                    }
                }
            
                if(foundUser === null)
                {
                    res.status(404).send({message:`${req.params.userId} was not found`});
                }
                else
                {
                    res.status(200).send(foundUser);
                }
            }
            else{
                res.status(401).send({message:`Invalid UserId`});
            }
        }
        catch(ex){
            res.status(401).send({message: 'Not Authorized'});
        }
    }
    else
    {
        res.status(401).send({message: 'Missing Authentication Header'});
    }
});

usersRouter.delete('/:userId', (req,res,next)=>{
    let foundUser = false;

    if(req.headers.authorization)
    {
        try
        {
            let tokenPayload = jwt.verify(req.headers.authorization.split(' ')[1].toString(), SECRET_KEY) as {userId:string, firstName:string, iat: number, exp:number, sub: string};
            if(tokenPayload.userId === req.params.userId)
            {
                for(var i = 0; i < userArray.length; i++)
                {
                    if(userArray[i].userId === req.params.userId)
                    {
                        foundUser = true;
                        userArray.splice(i,1);
                        break;
                    }
                }
                
                if(foundUser === false){
                    res.status(404).send({message: `${req.params.firstName} was not found`});
                }
                else{
                    
                    for(var i = 0; i < postArray.length; i++){
                        if(postArray[i].userId === req.params.userId){
                            postArray.splice(i,1);
                            res.status(204).send({message: 'User and Posts are deleted'});
                        }
                    }
                }
            }
            else{
                res.status(401).send({message: 'Invalid userId'});
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

usersRouter.get("/:userId/:password", (req,res,next)=>
{
    // result == true
    let foundUser: User | undefined = undefined;

        for(var i=0; i<userArray.length; i++)
        {
            if(userArray[i].userId === req.params.userId)
            {
                foundUser = userArray[i];
            }
        }
      
        if(foundUser !== undefined)
        {
            bcrypt.compare(req.params.password, foundUser.password, function(err, result) {
                if(result)
                { 
                    //result is true, logged in
                    //secret token for authorization
                    let token = jwt.sign({userId: foundUser?.userId, firstName: foundUser?.firstName}, SECRET_KEY, {expiresIn:100, subject:foundUser?.userId});
                    res.send(token);
                }
                else
                {
                    res.status(401).send({message:'Invalid Password'});
                }
            });
        }
        else
        {
            res.status(401).send({message:'Invalid Username'});
        }
});

export {usersRouter, SECRET_KEY}
