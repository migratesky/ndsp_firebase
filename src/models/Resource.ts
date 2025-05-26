import { Schema, model } from 'mongoose';

interface IResource {
  id: string;
  title: string;
  type: string;
  link: string;
  category: string;
  description: string;
}

const resourceSchema = new Schema<IResource>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  link: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true }
});

export const Resource = model<IResource>('Resource', resourceSchema);
