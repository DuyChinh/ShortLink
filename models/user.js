'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    name: DataTypes.STRING(30),
    email: DataTypes.STRING(100),
    password: DataTypes.STRING(100),
    status: DataTypes.BOOLEAN,
    provider_id: DataTypes.INTEGER,
    urlAvatar: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users', //name table in database
    createdAt: 'created_at',
    updatedAt: "updated_at",
  });
  return User;
};