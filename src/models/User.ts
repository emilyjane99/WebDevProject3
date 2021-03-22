class User {
    userId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;

    constructor(userId:string, firstName:string, lastName:string, emailAddress:string,password:string)
    {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = password;
    }

    toJSON()
    {
        //override json method to not return a password
        let newUser = <any> new User(this.userId, this.firstName, this.lastName, this.emailAddress,'');
        delete newUser.password;
        return newUser;
    }

    /*validatePassword(password: string){
        validated:false;
        return this.validatePassword;
    }*/
}

export {User};