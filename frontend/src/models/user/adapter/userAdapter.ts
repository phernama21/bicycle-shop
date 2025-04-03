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

export const multiple = (userData: any): User[] => {
  if(Array.isArray(userData)){
    const users = userData.map((user) => {
      if(user?.id === undefined){
        throw new Error('User has no id.')
      }else{
        return single(user);
      }
    })
    return users
  }else{
    return []
  }
}

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