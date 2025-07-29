import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

/**
 * Decorator for standardized API responses
 */
export const ApiStandardResponse = <TModel extends Type<unknown>>(
  model: TModel,
  options?: Omit<ApiResponseOptions, 'type'>
): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      ...options,
      type: model,
      description: options?.description || 'Successful response',
    })
  );
};

/**
 * Decorator for paginated API responses
 */
export const ApiPaginatedResponse = <TModel extends Type<unknown>>(
  model: TModel,
  options?: Omit<ApiResponseOptions, 'type'>
): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      ...options,
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: `#/components/schemas/${model.name}` },
              },
              meta: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  totalPages: { type: 'number' },
                },
              },
            },
          },
        ],
      },
      description: options?.description || 'Paginated response',
    })
  );
};
