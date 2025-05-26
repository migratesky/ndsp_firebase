import { Schema, model } from 'mongoose';

interface IAnnouncement {
  id: string;
  date: string;
  content: string;
  cite?: string;
}

const announcementSchema = new Schema<IAnnouncement>({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
  cite: String
});

export const Announcement = model<IAnnouncement>('Announcement', announcementSchema);
