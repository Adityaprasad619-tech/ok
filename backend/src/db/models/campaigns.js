const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const campaigns = sequelize.define(
    'campaigns',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

title: {
        type: DataTypes.TEXT,

      },

goal_amount: {
        type: DataTypes.DECIMAL,

      },

raised_amount: {
        type: DataTypes.DECIMAL,

      },

end_date: {
        type: DataTypes.DATE,

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

  campaigns.associate = (db) => {

    db.campaigns.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.campaigns.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return campaigns;
};

