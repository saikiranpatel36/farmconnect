// matches what the backend actually sends back over json (mongoose
// serializes Decimal128/ObjectId differently than the schema types)

export type UserRole = 'admin' | 'user';

export interface User {
  _id: string;
  userName: string;
  email: string;
  mobile: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

// mongoose sends decimal128 fields as this shape, not a plain number
export interface Decimal128Value {
  $numberDecimal: string;
}

export interface Feed {
  _id: string;
  feedName: string;
  type: string;
  description: string;
  unit: string;
  pricePerUnit: Decimal128Value | string;
}

export type VaccinationStatus = 'Vaccinated' | 'Not Vaccinated' | 'Up to date' | '';

export interface LivestockAttachment {
  filename?: string;
  path?: string;
  mimetype?: string;
  size?: number;
}

export interface Livestock {
  _id: string;
  name: string;
  species: string;
  age: number | string;
  breed: string;
  healthCondition: string;
  location: string;
  vaccinationStatus: VaccinationStatus;
  userId: string;
  attachment?: LivestockAttachment;
  createdAt?: string;
  updatedAt?: string;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface FeedRequest {
  _id: string;
  userId: string | User;
  feedId: string | Feed;
  livestockId: string | Livestock;
  quantity: number | string;
  status: RequestStatus;
  requestDate?: string;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
}
