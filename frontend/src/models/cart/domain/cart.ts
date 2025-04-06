export interface CartItemOption {
    id?: number;
    cartItemId?: number;
    optionId: number;
    optionName: string;
    componentName: string;
    price: number;
  }
  
  export interface CartItem {
    id?: number;
    cartId?: number;
    product: number;
    productName: string;
    price: number;
    quantity: number;
    options: CartItemOption[];
    imageSrc?: string;
  }
  
  export interface Cart {
    id?: number;
    userId?: number;
    status: 'active' | 'abandoned' | 'ordered';
    items: CartItem[];
  }