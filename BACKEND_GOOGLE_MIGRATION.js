/**
 * Database Migration: Add Google OAuth Support
 *
 * Location: backend/migrations/YYYYMMDDHHMMSS-add-google-oauth.js
 *
 * Run with: npx sequelize-cli db:migrate
 * (or your migration command)
 */

'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'google_id', {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
        });

        // Add index for faster lookups
        await queryInterface.addIndex('users', ['google_id'], {
            name: 'users_google_id_index',
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeIndex('users', 'users_google_id_index');
        await queryInterface.removeColumn('users', 'google_id');
    }
};
