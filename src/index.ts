import { usersRouter } from './routes/userRoute';
import bodyParser from "body-parser";
import express from "express";
import { postRouter } from './routes/postRoute';
import path from 'node:path';

let app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/Users', usersRouter);
app.use('/Posts', postRouter);

app.listen(3000);