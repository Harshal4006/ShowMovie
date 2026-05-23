describe('ErrorMiddleware', () => {
  let ErrorHandler;

  beforeAll(() => {
    ErrorHandler = require('../../Middleware/ErrorMiddleware');
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('handles ValidationError with 400', () => {
    const err = { name: 'ValidationError', message: 'Validation failed' };
    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    ErrorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation failed',
    });
  });

  it('handles CastError with 400', () => {
    const err = { name: 'CastError', message: 'Invalid ObjectId' };
    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    ErrorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid ID format',
    });
  });

  it('handles duplicate key error (code 11000) with 409', () => {
    const err = { code: 11000, message: 'Duplicate key' };
    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    ErrorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Duplicate entry. This record already exists.',
    });
  });

  it('handles unknown error with 500 by default', () => {
    const err = new Error('Something went wrong');
    const req = {};
    const res = mockResponse();
    const next = jest.fn();

    ErrorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error',
    });
  });

  it('uses custom statusCode when set on err', () => {
    const err = new Error('Custom error');
    err.statusCode = 400;
    const req = {};
    const res = mockResponse();
    res.statusCode = 400;
    const next = jest.fn();

    ErrorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Custom error',
    });
  });
});
