import { Request, Response, NextFunction } from 'express';
import { School } from '../models/School';

export const validateSchool = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate required fields
    const { name, country, city, address, website } = req.body;
    if (!name || !country || !city || !address || !website) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate coordinates if provided
    if (req.body.lat && isNaN(req.body.lat)) {
      return res.status(400).json({ message: 'Latitude must be a number' });
    }
    if (req.body.lng && isNaN(req.body.lng)) {
      return res.status(400).json({ message: 'Longitude must be a number' });
    }

    // Create a temporary school document for validation
    const school = new School(req.body);
    const validationError = school.validateSync();
    if (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Validation error' });
    }
  }
};
