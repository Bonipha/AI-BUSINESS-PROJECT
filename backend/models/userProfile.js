const userProfileSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['userId', 'createdAt'],
    additionalProperties: false,
    properties: {
      _id: { bsonType: 'objectId' },
      userId: { bsonType: 'objectId' },
      displayName: { bsonType: 'string' },
      avatarUrl: { bsonType: 'string' },
      phone: { bsonType: 'string' },
      address: { bsonType: 'string' },
      bio: { bsonType: 'string' },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
    },
  },
};

export { userProfileSchema };