import mongoose, { Document } from 'mongoose';

export interface InstrumentDocument extends Document {
  isin: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export const InstrumentSchema = new mongoose.Schema({
  isin: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});
