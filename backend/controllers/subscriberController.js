import asyncHandler from 'express-async-handler';
import Subscriber from '../models/SubscriberModel.js';

//@desc       Create a new subscriber with email
//route       POST /api/subscriber
//@access     public
const createSubscriber = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const subscriberExists = await Subscriber.findOne({ email: email });
  if (subscriberExists) {
    return res.status(202).json({
      status: 'exists',
      message: 'This email address is already subscribed to the newsletter.',
    });
  }
  const newSubscriber = await Subscriber.create({ email });
  if (newSubscriber) {
    res
      .status(201)
      .json({
        status: 'success',
        message: `${newSubscriber.email} subscription successful`,
      });
  } else {
    res.status(400);
    throw new Error('Invalid subscriber data');
  }
});

export { createSubscriber };
