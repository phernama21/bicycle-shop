import { AuthResponse, User } from "../domain/user";

export const single = (userData: any): User => {
  return {
    id: userData.id,
    email: userData.email,
    firstName: userData.first_name || '',
    lastName: userData.last_name || '',
    isAdmin: userData.is_admin || false,
    createdAt: new Date(userData.created_at),
    updatedAt: new Date(userData.updated_at),
  };
};

export const singleWithToken = (response: any): AuthResponse => {
  return {
    user: single(response.data.user),
    headers: {
      'access-token': response.headers['access-token'],
      client: response.headers.client,
      uid: response.headers.uid,
    }
  };
};