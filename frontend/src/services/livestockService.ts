import { AxiosResponse } from 'axios';
import api from '../api/axios';
import { API_URL } from '../config';
import { Livestock } from '../types/models';

// Get all livestocks
export const getAllLivestocks = (): Promise<AxiosResponse<Livestock[]>> => {
  return api.get('/livestock/getAllLivestock');
};

// Get livestock by ID
export const getLivestockById = (id: string): Promise<AxiosResponse<Livestock>> => {
  return api.get(`/livestock/getLivestockById/${id}`);
};

// Add new livestock (multipart/form-data)
export const addLivestock = (formData: FormData): Promise<AxiosResponse<{ message: string }>> => {
  return api.post('/livestock/addLivestock', formData);
};

// Update existing livestock (multipart/form-data)
export const updateLivestock = (
  id: string,
  formData: FormData
): Promise<AxiosResponse<{ message: string; livestock: Livestock }>> => {
  return api.put(`/livestock/updateLivestock/${id}`, formData);
};

// Get livestock by user ID
export const getLivestockByUserId = (userId: string): Promise<AxiosResponse<Livestock[]>> => {
  return api.get(`/livestock/getLivestockByUserId/${userId}`);
};

// Delete livestock
export const deleteLivestock = (id: string): Promise<AxiosResponse<{ message: string }>> => {
  return api.delete(`/livestock/deleteLivestock/${id}`);
};

// Returns a blob URL for the livestock's attachment, ready to use in an <img src>.
export const getFileByLivestockId = async (id: string): Promise<string> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/liveStock/getFileByLivestockId/${id}/file`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
