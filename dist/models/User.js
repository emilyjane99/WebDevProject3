"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(userId, firstName, lastName, emailAddress, password) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = password;
    }
    toJSON() {
        //override json method to not return a password
        let newUser = new User(this.userId, this.firstName, this.lastName, this.emailAddress, '');
        delete newUser.password;
        return newUser;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map