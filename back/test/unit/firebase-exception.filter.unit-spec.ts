import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FirebaseExceptionFilter } from '../../src/filters/firebase-exception.filter';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Logger: jest.fn(() => ({
    error: jest.fn(),
  })),
}));

describe('FirebaseExceptionFilter', () => {
  let filter: FirebaseExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;
  let mockRequest: any;

  beforeEach(() => {
    filter = new FirebaseExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockRequest = {
      method: 'GET',
      originalUrl: '/test',
    };
    mockArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as any;
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(exception.getResponse());
  });

  it('should handle Firebase auth errors correctly', () => {
    const exception = {
      code: 'auth/invalid-token',
      message: 'The token is invalid.',
    };

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 401,
      message: 'The token is invalid.',
      error: 'Unauthorized',
      code: 'auth/invalid-token',
    });
  });

  it('should handle unhandled errors as InternalServerErrorException', () => {
    const exception = new Error('Some unexpected error');

    filter.catch(exception, mockArgumentsHost);

    const expectedError = new InternalServerErrorException(
      'Some unexpected error',
    );
    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith(expectedError.getResponse());
  });

  it('should handle unhandled non-Error objects', () => {
    const exception = { some: 'object' };

    filter.catch(exception, mockArgumentsHost);

    const expectedError = new InternalServerErrorException('Unexpected error');
    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith(expectedError.getResponse());
  });
});
