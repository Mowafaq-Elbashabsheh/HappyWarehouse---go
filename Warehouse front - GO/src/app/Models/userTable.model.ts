export class UserTable {
    id: any;
    email: any;
    fullName: any;
    password: any;
    role: any;
    roleId: any;
    active: boolean;

    constructor(userObj: any) {
        this.id = userObj.id;
        this.email =  userObj.email;
        this.fullName =  userObj.fullName;
        this.password =  userObj.password;
        this.role =  userObj.role;
        this.roleId =  userObj.roleId;
        this.active = userObj.active
    }
}