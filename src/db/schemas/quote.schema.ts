import mongoose, { Document } from 'mongoose';

export interface QuoteDocument extends Document {
  id: string;
  resource: string;
  eventType: string;
}

export const QuoteSchema = new mongoose.Schema({
  instrumentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Instrument',
    required: true,
  },
  price: { type: Number, required: true },
  createdAt: { type: Date, required: true },
});
