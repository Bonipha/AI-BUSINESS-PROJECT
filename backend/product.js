const productSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'price', 'stock', 'createdAt'],
    additionalProperties: false,
    properties: {
      _id: { bsonType: 'objectId' },
      name: {
        bsonType: 'string',
        description: 'Product name is required and must be a string',
      },
      description: { bsonType: 'string' },
      price: {
        bsonType: ['decimal', 'double', 'int', 'long'],
        minimum: 0,
        description: 'Product price must be a non-negative number',
      },
      stock: {
        bsonType: ['int', 'long'],
        minimum: 0,
        description: 'Product stock must be a non-negative integer',
      },
      category: { bsonType: 'string' },
      imageUrl: { bsonType: 'string' },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
    },
  },
};

function productCollectionOptions() {
  return {
    validator: productSchema,
    validationLevel: 'strict',
    validationAction: 'error',
  };
}

module.exports = { productCollectionOptions, productSchema };
