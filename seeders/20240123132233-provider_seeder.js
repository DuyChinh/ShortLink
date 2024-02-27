'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    // await queryInterface.bulkInsert( [{
    //  name: 'John Doe',
    //   name: "email",
    //   status: true,
    //   provider_id: 1,
    //   created_at: new Date(),
    //   updated_at: new Date(),
    //  }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
