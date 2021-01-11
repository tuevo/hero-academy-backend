const UserConstant = require('../modules/users/users.constant');

module.exports = {
  USER: {
    usersInfo: ['Admin', 'Lecturer'],
    userDetail: {
      ['Admin']: {
        role: UserConstant.ROLE.ADMIN,
        email: 'admin2020@gmail.com',
        fullName: 'Admin',
        avatarUrl:
          'https://c0.klipartz.com/pngpicture/306/70/gratis-png-gestion-de-iconos-de-ordenador-admin-thumbnail.png',
        isConfirmed: true,
      },
      ['Lecturer']: {
        role: UserConstant.ROLE.LECTURER,
        email: 'lecturer2020@gmail.com',
        fullName: 'Lecturer',
        avatarUrl:
          'https://c0.klipartz.com/pngpicture/306/70/gratis-png-gestion-de-iconos-de-ordenador-admin-thumbnail.png',
        isConfirmed: true,
      },
    },
  },
};
