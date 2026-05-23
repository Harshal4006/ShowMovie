process.env.RAZORPAY_KEY_ID = 'test_key_id';
process.env.RAZORPAY_KEY_SECRET = 'test_key_secret';

jest.mock('@clerk/express', () => {
  const mockGetAuth = jest.fn();
  return {
    getAuth: mockGetAuth,
    clerkMiddleware: jest.fn((req, res, next) => next()),
  };
});

const { getAuth } = require('@clerk/express');

jest.mock('../../Config/Razorpay', () => ({
  orders: {
    create: jest.fn(),
  },
}));

jest.mock('../../Inngest/Inngest', () => ({
  inngest: { send: jest.fn() },
  functions: [],
}));

jest.mock('../../Utils/ensureDbConnection', () => jest.fn(() => Promise.resolve()));

const razorpayInstance = require('../../Config/Razorpay');

jest.mock('../../Models/User', () => ({
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock('../../Models/Show', () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

jest.mock('../../Models/Booking', () => ({
  create: jest.fn(),
  findById: jest.fn(),
}));

jest.mock('../../Controllers/NotificationController', () => ({
  CreateNotification: jest.fn(),
}));

const User = require('../../Models/User');
const Show = require('../../Models/Show');

describe('PaymentController', () => {
  let PaymentController;

  beforeAll(() => {
    PaymentController = require('../../Controllers/PaymentController');
  });

  beforeEach(() => {
    getAuth.mockReset();
    jest.clearAllMocks();
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe('CreateOrder', () => {
    it('returns 400 when amount is missing', async () => {
      const req = { body: {} };
      const res = mockResponse();

      await PaymentController.CreateOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Amount is required',
      });
    });

    it('creates Razorpay order and returns order details', async () => {
      razorpayInstance.orders.create.mockResolvedValue({
        id: 'order_test123',
        amount: 50000,
        currency: 'INR',
      });

      const req = { body: { amount: 500 } };
      const res = mockResponse();

      await PaymentController.CreateOrder(req, res);

      expect(razorpayInstance.orders.create).toHaveBeenCalledWith({
        amount: 50000,
        currency: 'INR',
        receipt: expect.any(String),
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        orderId: 'order_test123',
        amount: 50000,
        currency: 'INR',
        key: 'test_key_id',
      });
    });

    it('returns 500 on Razorpay error', async () => {
      razorpayInstance.orders.create.mockRejectedValue(new Error('Razorpay error'));

      const req = { body: { amount: 500 } };
      const res = mockResponse();

      await PaymentController.CreateOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Razorpay error',
      });
    });
  });

  describe('VerifyPayment', () => {
    const validReqBody = {
      razorpay_order_id: 'order_test123',
      razorpay_payment_id: 'pay_test123',
      razorpay_signature: 'test_signature',
      showId: 'show_test123',
      bookedSeats: ['A1', 'A2'],
      amount: 500,
    };

    it('returns 401 when no userId', async () => {
      getAuth.mockReturnValue({ userId: null });
      const req = { body: validReqBody };
      const res = mockResponse();

      await PaymentController.VerifyPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
    });

    it('returns 400 when missing payment details', async () => {
      getAuth.mockReturnValue({ userId: 'test_user' });
      const req = { body: {} };
      const res = mockResponse();

      await PaymentController.VerifyPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing payment verification details',
      });
    });
  });
});
