"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRoute_1 = require("./routes/userRoute");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const postRoute_1 = require("./routes/postRoute");
let app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use('/Users', userRoute_1.usersRouter);
app.use('/Posts', postRoute_1.postRouter);
app.listen(3000);
//# sourceMappingURL=index.js.map