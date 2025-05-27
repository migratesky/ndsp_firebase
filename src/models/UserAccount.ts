
import { Schema, model, models } from 'mongoose';
import type { UserAccount, UserRole, UserAccountStatus } from '@/types';
import { UserRoles, UserAccountStatuses } from '@/types';

const UserAccountSchema = new Schema<UserAccount>({
  username: {
    type: String,
    required: [true, 'Username (Login ID) is required.'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    unique: true,
    trim: true,
    lowercase: true,
    // Basic email format validation
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  fullName: {
    type: String,
    trim: true,
  },
  roles: {
    type: [{
      type: String,
      enum: UserRoles,
    }],
    required: [true, 'At least one role must be assigned.'],
    validate: {
      validator: (v: UserRole[]) => Array.isArray(v) && v.length > 0,
      message: 'At least one role must be assigned.'
    }
  },
  status: {
    type: String,
    enum: UserAccountStatuses,
    required: [true, 'Account status is required.'],
    default: 'Active',
  },
  lastLogin: {
    type: Date,
  }
}, { timestamps: true }); // timestamps will add createdAt and updatedAt

// Ensure the model is not redefined if it already exists (common in Next.js dev environment)
export const UserAccountModel = models.UserAccount || model<UserAccount>('UserAccount', UserAccountSchema);
