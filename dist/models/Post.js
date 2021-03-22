"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postArray = exports.Post = void 0;
class Post {
    constructor(title, content, userId, headerImage) {
        this.postId = postArray.length + 1;
        this.createdDate = new Date;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.headerImage = headerImage;
        this.lastUpdatedDate = new Date;
    }
}
exports.Post = Post;
const postArray = [];
exports.postArray = postArray;
//# sourceMappingURL=Post.js.map