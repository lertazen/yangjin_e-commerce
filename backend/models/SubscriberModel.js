import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dateSubscribed: {
    type: Date,
    default: Date.now,
  },
});

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

export default Subscriber;
