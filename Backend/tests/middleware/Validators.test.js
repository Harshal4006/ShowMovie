let mockChain;
const createMockChain = () => {
  const chain = {
    notEmpty: jest.fn().mockReturnThis(),
    isArray: jest.fn().mockReturnThis(),
    isString: jest.fn().mockReturnThis(),
    isFloat: jest.fn().mockReturnThis(),
    isInt: jest.fn().mockReturnThis(),
    isEmail: jest.fn().mockReturnThis(),
    isIn: jest.fn().mockReturnThis(),
    trim: jest.fn().mockReturnThis(),
    optional: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    custom: jest.fn().mockReturnThis(),
    isEmpty: jest.fn(() => true),
    array: jest.fn(() => []),
  };
  mockChain = chain;
  return chain;
};

jest.mock('express-validator', () => ({
  body: jest.fn(() => createMockChain()),
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: () => [],
  })),
}));

const { body, validationResult } = require('express-validator');

describe('Validators', () => {
  let Validators;

  beforeAll(() => {
    Validators = require('../../Middleware/Validators');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe('validateCreateBooking array', () => {
    it('returns middleware array with handleValidation', () => {
      const arr = Validators.validateCreateBooking;
      expect(Array.isArray(arr)).toBe(true);
      expect(arr.length).toBeGreaterThan(0);
    });

    it('returns 400 when validation fails', () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ path: 'showId', msg: 'Show ID is required' }],
      });

      const req = {};
      const res = mockResponse();
      const next = jest.fn();

      const handleValidation = Validators.validateCreateBooking.find(
        (fn) => fn.name === 'handleValidation' || fn.toString().includes('validationResult')
      );

      handleValidation(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('calls next when validation passes', () => {
      validationResult.mockReturnValue({
        isEmpty: () => true,
      });

      const req = {};
      const res = mockResponse();
      const next = jest.fn();

      const handleValidation = Validators.validateCreateBooking.find(
        (fn) => fn.name === 'handleValidation' || fn.toString().includes('validationResult')
      );

      handleValidation(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('validateCreateOrder', () => {
    it('returns middleware array', () => {
      expect(Array.isArray(Validators.validateCreateOrder)).toBe(true);
      expect(Validators.validateCreateOrder.length).toBeGreaterThan(0);
    });
  });

  describe('validateImportMovie', () => {
    it('returns middleware array', () => {
      expect(Array.isArray(Validators.validateImportMovie)).toBe(true);
      expect(Validators.validateImportMovie.length).toBeGreaterThan(0);
    });
  });

  describe('validateCreateShow', () => {
    it('returns middleware array', () => {
      expect(Array.isArray(Validators.validateCreateShow)).toBe(true);
      expect(Validators.validateCreateShow.length).toBeGreaterThan(0);
    });
  });
});
