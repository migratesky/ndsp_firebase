import { Router, Request, Response } from 'express';
import { School } from '../models/School';
import { StateGraduationRequirement } from '../models/StateGraduationRequirement';
import { Resource } from '../models/Resource';
import { Announcement } from '../models/Announcement';
import { ContactRegion } from '../models/ContactRegion';
import { validateSchool } from '../middlewares/validateSchool';

const router = Router();

// Helper function for error handling
const handleError = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'An unknown error occurred' });
  }
};

// School CRUD operations
router.get('/schools', async (req: Request, res: Response) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/schools', validateSchool, async (req: Request, res: Response) => {
  try {
    const newSchool = new School(req.body);
    const savedSchool = await newSchool.save();
    res.status(201).json(savedSchool);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

router.get('/schools/:id', async (req: Request, res: Response) => {
  try {
    const school = await School.findOne({ id: req.params.id });
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.json(school);
  } catch (error) {
    handleError(error, res);
  }
});

router.put('/schools/:id', validateSchool, async (req: Request, res: Response) => {
  try {
    const updatedSchool = await School.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedSchool) return res.status(404).json({ message: 'School not found' });
    res.json(updatedSchool);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

router.delete('/schools/:id', async (req: Request, res: Response) => {
  try {
    const deletedSchool = await School.findOneAndDelete({ id: req.params.id });
    if (!deletedSchool) return res.status(404).json({ message: 'School not found' });
    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    handleError(error, res);
  }
});

// State requirements routes
router.get('/state-requirements', async (req: Request, res: Response) => {
  try {
    const requirements = await StateGraduationRequirement.find();
    res.json(requirements);
  } catch (error) {
    handleError(error, res);
  }
});

router.get('/state-requirements/:name', async (req: Request, res: Response) => {
  try {
    const requirement = await StateGraduationRequirement.findOne({ 
      name: { $regex: new RegExp(req.params.name, 'i') } 
    });
    if (!requirement) return res.status(404).json({ message: 'State requirement not found' });
    res.json(requirement);
  } catch (error) {
    handleError(error, res);
  }
});

// Resource routes
router.get('/resources', async (req: Request, res: Response) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    handleError(error, res);
  }
});

// Announcement routes
router.get('/announcements', async (req: Request, res: Response) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (error) {
    handleError(error, res);
  }
});

// Contact region routes
router.get('/contact-regions', async (req: Request, res: Response) => {
  try {
    const regions = await ContactRegion.find();
    res.json(regions);
  } catch (error) {
    handleError(error, res);
  }
});

// Location data routes
router.get('/countries', async (req: Request, res: Response) => {
  try {
    const countries = await School.distinct('country');
    res.json(countries);
  } catch (error) {
    handleError(error, res);
  }
});

router.get('/cities/:country', async (req: Request, res: Response) => {
  try {
    const cities = await School.distinct('city', { country: req.params.country });
    res.json(cities);
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
