import { Request, Response } from 'express';
import Feed from '../models/feedModel';
import sanitizeHtml from 'sanitize-html';

// Get all Feeds
export const getAllFeeds = async (_req: Request, res: Response): Promise<void> => {
  try {
    const feeds = await Feed.find({});
    res.status(200).json(feeds);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get Feed by ID
export const getFeedById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const feed = await Feed.findById(id);
    if (!feed) {
      res.status(404).json({ message: `Cannot find any feed with ID ${id}` });
      return;
    }
    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Add a New Feed
export const addFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    let { feedName, type, description, unit, pricePerUnit } = req.body;
    feedName = feedName.toString();
    type = type.toString();
    description = description.toString();
    unit = unit.toString();
    const pricePerUnitNumber = parseInt(pricePerUnit, 10);
    await Feed.create({
      feedName: sanitizeHtml(feedName),
      type: sanitizeHtml(type),
      description: sanitizeHtml(description),
      unit: sanitizeHtml(unit),
      pricePerUnit: sanitizeHtml(pricePerUnitNumber.toString())
    });
    res.status(200).json({ message: 'Feed Added Successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Update an Existing Feed
export const updateFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedFeed = await Feed.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedFeed) {
      res.status(404).json({ message: `Cannot find any feed with ID ${id}` });
      return;
    }
    res.status(200).json({ message: 'Feed Updated Successfully', feed: updatedFeed });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Delete a Feed
export const deleteFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedFeed = await Feed.findByIdAndDelete(id);
    if (!deletedFeed) {
      res.status(404).json({ message: `Cannot find any feed with ID ${id}` });
      return;
    }
    res.status(200).json({ message: 'Feed Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
