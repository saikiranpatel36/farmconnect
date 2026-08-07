import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import sanitizeHtml from 'sanitize-html';
import Livestock from '../models/liveStockModel';

// get all livestock
// not paginated, fine for now since this isn't actually used anywhere on the frontend yet
export const getAllLivestock = async (_req: Request, res: Response): Promise<void> => {
  try {
    const livestock = await Livestock.find({});
    res.status(200).json(livestock);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// get one by id
export const getLivestockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const livestock = await Livestock.findById(req.params.id);
    if (!livestock) {
      res.status(404).json({ message: `Cannot find any livestock with ID ${req.params.id}` });
      return;
    }
    res.status(200).json(livestock);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// get livestock for a particular owner
export const getLivestockByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const livestock = await Livestock.find({ userId: req.params.id });
    res.status(200).json(livestock);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// add livestock
export const addLivestock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, species, age, breed, healthCondition, location, vaccinationStatus, userId } = req.body;
    if (!req.file) {
      res.status(400).json({ message: 'Attachment file is required' });
      return;
    }
    const newLivestock = new Livestock({
      name: sanitizeHtml(name),
      species: sanitizeHtml(species),
      age: sanitizeHtml(age),
      breed: sanitizeHtml(breed),
      healthCondition: sanitizeHtml(healthCondition),
      location: sanitizeHtml(location),
      vaccinationStatus: sanitizeHtml(vaccinationStatus),
      userId: sanitizeHtml(userId),
      attachment: {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });
    await newLivestock.save();
    res.status(200).json({ message: 'Livestock Added Successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// update livestock
export const updateLivestock = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData: Record<string, unknown> = { ...req.body };
    // if a new file is uploaded, update the attachment field
    // TODO: this doesn't delete the old file from /uploads when replaced, so
    // uploads folder will just keep growing. need to fs.unlink the old path here
    if (req.file) {
      updateData.attachment = {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    }
    const updatedLivestock = await Livestock.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedLivestock) {
      res.status(404).json({ message: `Cannot find any livestock with ID ${req.params.id}` });
      return;
    }
    res.status(200).json({ message: 'Livestock Updated Successfully', livestock: updatedLivestock });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// delete livestock
export const deleteLivestock = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedLivestock = await Livestock.findByIdAndDelete(req.params.id);
    if (!deletedLivestock) {
      res.status(404).json({ message: `Cannot find any livestock with ID ${req.params.id}` });
      return;
    }
    res.status(200).json({ message: 'Livestock Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// send back the uploaded attachment file
export const getFileByLivestockId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const livestock = await Livestock.findById(req.params.id);
    if (!livestock) {
      res.status(404).json({ message: `Cannot find any livestock with ID ${req.params.id}` });
      return;
    }
    const file = livestock.attachment;
    const filepath = path.resolve(__dirname, '..', `${file?.path}`);
    if (!fs.existsSync(filepath)) {
      res.status(404).send('No such directory or file found.');
      return;
    }
    res.sendFile(filepath);
  } catch (error) {
    next(error);
  }
};
