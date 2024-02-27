'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Link extends Model {
    static associate(models) {
      // define association here
    }
  }
  Link.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.INTEGER,
      root_link: DataTypes.STRING,
      compact_link: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
      },

      view: {
        type: DataTypes.INTEGER,
      },

      secure: DataTypes.BOOLEAN,

      created_at: {
        type: DataTypes.DATE(),
        // defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE(),
        // defaultValue: DataTypes.literal("CURRENT_TIMESTAMP"),
      },
      code: {
        type: DataTypes.STRING,
      }
    },
    {
      sequelize,
      modelName: "Link",
      tableName: "links",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Link;
};