const UserConstant = require('../modules/user/user.constant');

module.exports = {
  USER: {
    usersInfo: ["master"],
    userDetail: {
      ["master"]: {
        username: 'master',
        role: UserConstant.ROLE.MASTER,
        email: 'master2020@gmail.com',
        fullName: 'master',
        phoneNumber: '0328836666'
      }
    }
  }
}