import { AxiosResponse } from 'axios';
import api from '../api/axios';
import { FeedRequest, RequestStatus } from '../types/models';

export interface AddRequestPayload {
  feedId: string;
  livestockId: string;
  userId: string;
  quantity: string | number;
  status: RequestStatus;
}

export interface UpdateRequestPayload {
  status?: RequestStatus;
  reason?: string;
}

export const addRequest = (
  requestObject: AddRequestPayload
): Promise<AxiosResponse<{ message: string; request: FeedRequest }>> => {
  return api.post('/request/addRequest', requestObject);
};

export const getRequestsByUserId = (userId: string): Promise<AxiosResponse<FeedRequest[]>> => {
  return api.get(`/request/getRequestsByUserId/${userId}`);
};

export const deleteRequest = (requestId: string): Promise<AxiosResponse<{ message: string }>> => {
  return api.delete(`/request/deleteRequest/${requestId}`);
};

export const updateRequest = (
  requestId: string,
  request: UpdateRequestPayload
): Promise<AxiosResponse<{ message: string; request: FeedRequest }>> => {
  return api.put(`/request/updateRequest/${requestId}`, request);
};

export const getAllRequests = (): Promise<AxiosResponse<FeedRequest[]>> => {
  return api.get('/request/getAllRequests');
};
