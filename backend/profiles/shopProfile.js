const shopProfileSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['shopId', 'createdAt'],
    additionalProperties: false,
    properties: {
      _id: { bsonType: 'objectId' },
      shopId: { bsonType: 'objectId' },
      tagline: { bsonType: 'string' },
      bannerUrl: { bsonType: 'string' },
      businessHours: { bsonType: 'object' },
      socialLinks: { bsonType: 'object' },
      policies: { bsonType: 'string' },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
    },
  },
};

module.exports = { shopProfileSchema };
