import {
  CreateSwaggerDocs,
  FindAllSwaggerDocs,
  FindOneSwaggerDocs,
  RemoveSwaggerDocs,
  TestConnectionSwaggerDocs,
  UpdateSwaggerDocs,
} from './swagger';

// Swagger decorators for CRUD operations
export const CrudSwaggerDocs = {
  create: CreateSwaggerDocs,
  findAll: FindAllSwaggerDocs,
  findOne: FindOneSwaggerDocs,
  update: UpdateSwaggerDocs,
  remove: RemoveSwaggerDocs,
  testConnection: TestConnectionSwaggerDocs,
};
