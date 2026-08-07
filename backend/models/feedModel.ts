import mongoose, { Document, Schema } from 'mongoose';

export interface IFeed extends Document {
  feedName: string;
  type: string;
  description: string;
  unit: string;
  pricePerUnit: mongoose.Types.Decimal128;
}

const feedSchema = new Schema<IFeed>({
  feedName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  pricePerUnit: {
    type: Schema.Types.Decimal128,
    required: true
  }
});

export default mongoose.model<IFeed>('Feed', feedSchema);
