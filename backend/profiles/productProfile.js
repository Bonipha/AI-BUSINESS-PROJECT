const productProfileSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['productId', 'createdAt'],
    additionalProperties: false,
    properties: {
      _id: { bsonType: 'objectId' },
      productId: { bsonType: 'objectId' },
      specifications: { bsonType: 'object' },
      tags: {
        bsonType: 'array',
        items: { bsonType: 'string' },
      },
      gallery: {
        bsonType: 'array',
        items: { bsonType: 'string' },
      },
      featured: { bsonType: 'bool' },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
    },
  },
};

module.exports = { productProfileSchema };
