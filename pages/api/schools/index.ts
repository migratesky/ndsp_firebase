import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../src/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { db } = await connectToDatabase();
      
      // Get data from request body
      const { 
        name, 
        address, 
        city, 
        state, 
        zipCode, 
        phone, 
        email 
      } = req.body;

      // Validate required fields
      if (!name || !address || !city || !state || !zipCode) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create school document with required fields
      // Adding default values for required fields not in the form
      const schoolData = {
        id: uuidv4(),
        name,
        address,
        city,
        state,
        zipCode,
        phone,
        email,
        // Default values for required fields in the model
        country: 'US',
        website: `https://${name.toLowerCase().replace(/\s+/g, '-')}.example.com`,
        gradesServed: 'K-12',
        instructionInEnglish: true,
        publicPrivate: 'Public',
        boardingOption: false,
        accreditation: 'State Accredited',
        // Default coordinates (can be updated later)
        lat: 37.7749,
        lng: -122.4194
      };

      // Insert school into database
      const result = await db.collection('schools').insertOne(schoolData);

      if (result.acknowledged) {
        return res.status(201).json({ 
          success: true, 
          message: 'School added successfully',
          school: { ...schoolData, _id: result.insertedId }
        });
      } else {
        throw new Error('Failed to add school to database');
      }
    } catch (error) {
      console.error('Error adding school:', error);
      return res.status(500).json({ 
        error: 'An error occurred while adding the school',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const schools = await db.collection('schools').find({}).toArray();
      return res.status(200).json(schools);
    } catch (error) {
      console.error('Error fetching schools:', error);
      return res.status(500).json({ 
        error: 'An error occurred while fetching schools',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
