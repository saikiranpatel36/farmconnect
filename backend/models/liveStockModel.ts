import mongoose, { Document, Schema, Types } from 'mongoose';

export type VaccinationStatus = 'Vaccinated' | 'Not Vaccinated' | 'Up to date';

export interface ILivestockAttachment {
  filename?: string;
  path?: string;
  mimetype?: string;
  size?: number;
}

export interface ILivestock extends Document {
  name: string;
  species: string;
  age: number;
  breed: string;
  healthCondition: string;
  location: string;
  vaccinationStatus: VaccinationStatus;
  userId: Types.ObjectId;
  attachment?: ILivestockAttachment;
  createdAt?: Date;
  updatedAt?: Date;
}

const livestockSchema = new Schema<ILivestock>(
  {
    name: {
      type: String,
      required: true
    },
    species: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    breed: {
      type: String,
      required: true
    },
    healthCondition: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    vaccinationStatus: {
      type: String,
      required: true,
      enum: ['Vaccinated', 'Not Vaccinated', 'Up to date']
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    attachment: {
      filename: {
        type: String
      },
      path: {
        type: String
      },
      mimetype: {
        type: String
      },
      size: {
        type: Number
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model<ILivestock>('Livestock', livestockSchema);
