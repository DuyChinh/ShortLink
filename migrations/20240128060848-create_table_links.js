'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("links", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        }
      },

      root_link: {
        type: Sequelize.STRING,
      },

      compact_link: {
        type: Sequelize.STRING,
      },

      password: {
        type: Sequelize.STRING,
      },

      view: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      secure: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      code: {
        type: Sequelize.STRING,
      },

      created_at: {
        type: Sequelize.DATE(),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE(),
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("links");
  }
};
