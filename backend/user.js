const baseUserProperties = {
  _id: { bsonType: 'objectId' },
  email: {
    bsonType: 'string',
    description: 'User email is required and must be a string',
  },
  name: { bsonType: 'string' },
  passwordHash: {
    bsonType: 'string',
    description: 'Store only a password hash, never a plaintext password',
  },
  passwordSalt: { bsonType: 'string' },
  createdAt: { bsonType: 'date' },
  updatedAt: { bsonType: 'date' },
};

function createUserSchema(role) {
  return {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'passwordHash', 'role', 'createdAt'],
      additionalProperties: false,
      properties: {
        ...baseUserProperties,
        role: { enum: [role] },
      },
    },
  };
}

const customerSchema = createUserSchema('customer');
const adminSchema = createUserSchema('admin');
const ownerSchema = createUserSchema('owner');

const userSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['email', 'passwordHash', 'role', 'createdAt'],
    additionalProperties: false,
    properties: {
      _id: { bsonType: 'objectId' },
      email: {
        bsonType: 'string',
        description: 'User email is required and must be a string',
      },
      name: { bsonType: 'string' },
      passwordHash: {
        bsonType: 'string',
        description: 'Store only a password hash, never a plaintext password',
      },
      passwordSalt: { bsonType: 'string' },
      role: {
        enum: ['customer', 'admin', 'owner'],
        description: 'User role is required',
      },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
    },
  },
};

function userCollectionOptions() {
  return {
    validator: userSchema,
    validationLevel: 'strict',
    validationAction: 'error',
  };
}

module.exports = {
  adminSchema,
  customerSchema,
  ownerSchema,
  userCollectionOptions,
  userSchema,
};
