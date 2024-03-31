import mongoose from 'mongoose';

export interface Quote {
  createdAt: Date;
  instrumentId: mongoose.Schema.Types.ObjectId;
  price: number;
}
