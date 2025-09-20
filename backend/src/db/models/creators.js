const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const creators = sequelize.define(
    'creators',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

profile_description: {
        type: DataTypes.TEXT,

      },

total_tipped: {
        type: DataTypes.DECIMAL,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  creators.associate = (db) => {

    db.creators.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.creators.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return creators;
};

