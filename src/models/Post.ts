class Post{
    postId:number;
    createdDate:Date;
    title:string;
    content:string;
    userId:string;
    headerImage:string;
    lastUpdatedDate:Date;

    constructor(title:string, content:string, userId:string, headerImage:string){
        this.postId = postArray.length + 1;
        this.createdDate = new Date;
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.headerImage = headerImage;
        this.lastUpdatedDate = new Date;
    }
}

const postArray:Post[]=[];
export {Post,postArray};