import mongoose, { Document, Schema, Types } from 'mongoose';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IRequest extends Document {
  userId: Types.ObjectId;
  feedId: Types.ObjectId;
  livestockId: Types.ObjectId;
  quantity: number;
  status: RequestStatus;
  requestDate: Date;
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const requestSchema = new Schema<IRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    feedId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Feed'
    },
    livestockId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Livestock'
    },
    quantity: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    requestDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    reason: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model<IRequest>('Request', requestSchema);
