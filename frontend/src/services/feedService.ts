import { AxiosResponse } from 'axios';
import api from '../api/axios';
import { Feed } from '../types/models';

export interface FeedPayload {
  feedName: string;
  type: string;
  description: string;
  unit: string;
  pricePerUnit: string | number;
}

// Fetch all feeds
export const getAllFeeds = (): Promise<AxiosResponse<Feed[]>> => {
  return api.get('/feed/getAllFeeds');
};

// Get feed by ID
export const getFeedById = (id: string): Promise<AxiosResponse<Feed>> => {
  return api.get(`/feed/getFeedById/${id}`);
};

// Add new feed
export const addFeed = (feed: FeedPayload): Promise<AxiosResponse<{ message: string }>> => {
  return api.post('/feed/addFeed', feed);
};

// Update existing feed
export const updateFeed = (
  id: string,
  feed: FeedPayload
): Promise<AxiosResponse<{ message: string; feed: Feed }>> => {
  return api.put(`/feed/updateFeed/${id}`, feed);
};

// Delete feed
export const deleteFeed = (id: string): Promise<AxiosResponse<{ message: string }>> => {
  return api.delete(`/feed/deleteFeed/${id}`);
};
