const shopSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'ownerId', 'createdAt'],
    additionalProperties: false,
    properties: {
      _id: { bsonType: 'objectId' },
      name: {
        bsonType: 'string',
        description: 'Shop name is required and must be a string',
      },
      description: { bsonType: 'string' },
      ownerId: {
        bsonType: 'objectId',
        description: 'The owner user ID is required',
      },
      email: { bsonType: 'string' },
      phone: { bsonType: 'string' },
      address: { bsonType: 'string' },
      logoUrl: { bsonType: 'string' },
      status: {
        enum: ['active', 'inactive', 'suspended'],
        description: 'Shop status must be active, inactive, or suspended',
      },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
    },
  },
};

function shopCollectionOptions() {
  return {
    validator: shopSchema,
    validationLevel: 'strict',
    validationAction: 'error',
  };
}

export { shopCollectionOptions, shopSchema };