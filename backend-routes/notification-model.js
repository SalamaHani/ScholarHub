/**
 * Notification Database Model
 * Choose the implementation that matches your database setup
 */

// ============================================================================
// OPTION 1: Sequelize Model (MySQL, PostgreSQL, SQLite)
// ============================================================================

/*
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Notification = sequelize.define('Notification', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('INFO', 'SUCCESS', 'WARNING', 'SCHOLARSHIP', 'APPLICATION'),
            defaultValue: 'INFO'
        },
        link: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'notifications',
        timestamps: true,
        indexes: [
            { fields: ['userId'] },
            { fields: ['isRead'] },
            { fields: ['createdAt'] }
        ]
    });

    return Notification;
};
*/

// ============================================================================
// OPTION 2: Prisma Schema
// ============================================================================

/*
Add this to your schema.prisma file:

model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  title     String
  message   String   @db.Text
  type      NotificationType @default(INFO)
  link      String?
  isRead    Boolean  @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
}

enum NotificationType {
  INFO
  SUCCESS
  WARNING
  SCHOLARSHIP
  APPLICATION
}

// Also add this to your User model:
model User {
  // ... existing fields
  notifications Notification[]
}

Then run:
npx prisma migrate dev --name add_notifications
npx prisma generate
*/

// ============================================================================
// OPTION 3: MongoDB/Mongoose Model
// ============================================================================

/*
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['INFO', 'SUCCESS', 'WARNING', 'SCHOLARSHIP', 'APPLICATION'],
        default: 'INFO'
    },
    link: {
        type: String,
        default: null
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
*/

// ============================================================================
// OPTION 4: Raw SQL Schema (PostgreSQL)
// ============================================================================

/*
CREATE TYPE notification_type AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'SCHOLARSHIP', 'APPLICATION');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'INFO',
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
*/

// ============================================================================
// OPTION 5: Raw SQL Schema (MySQL)
// ============================================================================

/*
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'SUCCESS', 'WARNING', 'SCHOLARSHIP', 'APPLICATION') DEFAULT 'INFO',
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_user_created (user_id, created_at DESC)
);
*/

module.exports = {
    message: 'Choose the model implementation that matches your database setup and uncomment it'
};
