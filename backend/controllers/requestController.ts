import { Request, Response } from 'express';
import sanitizeHtml from 'sanitize-html';
import RequestModel from '../models/requestModel';

// get all requests (for supplier dashboard)
export const getAllRequests = async (_req: Request, res: Response): Promise<void> => {
  try {
    const requests = await RequestModel.find({})
      .populate('feedId')
      .populate('livestockId')
      .populate('userId');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// get one request
export const getRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const request = await RequestModel.findById(req.params.id)
      .populate('feedId')
      .populate('livestockId');
    if (!request) {
      res.status(404).json({ message: `Cannot find any request with ID ${req.params.id}` });
      return;
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// get requests placed by one owner
export const getRequestsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await RequestModel.find({ userId: req.params.id }).populate([
      { path: 'feedId' },
      { path: 'livestockId' }
    ]);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// create a new feed request
// not checking for duplicate pending requests on the same feed+livestock right now,
// so a user could spam the same request multiple times. add a check later
export const addRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    let { feedId, userId, livestockId, quantity, status } = req.body;
    feedId = feedId.toString();
    userId = userId.toString();
    livestockId = livestockId.toString();
    const quantityNumber = parseInt(quantity, 10);
    status = status.toString();
    const newRequest = await RequestModel.create({
      feedId: sanitizeHtml(feedId),
      userId: sanitizeHtml(userId),
      livestockId: sanitizeHtml(livestockId),
      quantity: quantityNumber,
      status: sanitizeHtml(status)
    });
    res.status(200).json({ message: 'Request Added Successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// update request status/details
export const updateRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedRequest = await RequestModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRequest) {
      res.status(404).json({ message: `Cannot find any request with ID ${req.params.id}` });
      return;
    }
    res.status(200).json({ message: 'Request Updated Successfully', request: updatedRequest });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// delete request
export const deleteRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedRequest = await RequestModel.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      res.status(404).json({ message: `Cannot find any request with ID ${req.params.id}` });
      return;
    }
    res.status(200).json({ message: 'Request Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
