import { Schema, model } from 'mongoose';

interface ISchool {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
  website: string;
  phone?: string;
  gradesServed: string;
  instructionInEnglish: boolean;
  publicPrivate: string;
  boardingOption: boolean;
  boardingDetails?: string;
  accreditation: string;
  typicalClassSizes?: string;
  estimatedEnrollmentCount?: string;
  lat: number;
  lng: number;
  isVirtual?: boolean;
}

const schoolSchema = new Schema<ISchool>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  website: { type: String, required: true },
  phone: String,
  gradesServed: { type: String, required: true },
  instructionInEnglish: { type: Boolean, required: true },
  publicPrivate: { type: String, required: true },
  boardingOption: { type: Boolean, required: true },
  boardingDetails: String,
  accreditation: { type: String, required: true },
  typicalClassSizes: String,
  estimatedEnrollmentCount: String,
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  isVirtual: Boolean
});

export const School = model<ISchool>('School', schoolSchema);
