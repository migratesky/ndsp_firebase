import { Schema, model } from 'mongoose';

interface IContactRegion {
  id: string;
  regionName: string;
  services: {
    education: string;
    invoices: string;
    management: string;
    administration: string;
  };
}

const contactRegionSchema = new Schema<IContactRegion>({
  id: { type: String, required: true, unique: true },
  regionName: { type: String, required: true },
  services: {
    education: { type: String, required: true },
    invoices: { type: String, required: true },
    management: { type: String, required: true },
    administration: { type: String, required: true }
  }
});

export const ContactRegion = model<IContactRegion>('ContactRegion', contactRegionSchema);
