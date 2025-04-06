import { User } from "@/models/user/domain/user";

  export interface Order {
    id: number;
    user: User;
    status: 'pending' | 'paid' | 'cancelled';
    amount: number;
    nItems: number;
    createdAt: Date;
  }