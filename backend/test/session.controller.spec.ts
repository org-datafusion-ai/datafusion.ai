import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from '../src/sessionManagement/session.controller';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Mock UUID to control randomness
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('SessionController', () => {
  let controller: SessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
    }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  describe('getSession', () => {
    it('should return the session token from cookies', () => {
      const mockRequest = {
        cookies: {
          session_token: 'abc123',
        },
      } as unknown as Request;

      const result = controller.getSession(mockRequest);
      expect(result).toEqual({ token: 'abc123' });
    });
  });

  describe('createNewSession', () => {
    it('should set a session cookie and return the token', () => {
      const mockResponse = {
        cookie: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      const fakeToken = 'test-uuid';
      (uuidv4 as jest.Mock).mockReturnValue(fakeToken);

      controller.createNewSession(mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith('session_token', fakeToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      });

      expect(mockResponse.json).toHaveBeenCalledWith({ token: fakeToken });
    });
  });
});
