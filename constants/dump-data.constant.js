const UserConstant = require('../modules/users/users.constant');

module.exports = {
  USER: {
    usersInfo: ['Admin'],
    userDetail: {
      ['Admin']: {
        role: UserConstant.ROLE.ADMIN,
        email: 'admin2020@gmail.com',
        fullName: 'Admin',
        avatarUrl:
          'https://c0.klipartz.com/pngpicture/306/70/gratis-png-gestion-de-iconos-de-ordenador-admin-thumbnail.png',
        isConfirmed: true,
      },
    },
  },
};
