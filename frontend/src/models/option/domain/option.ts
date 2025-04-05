export interface Option {
    id?: number;
    name: string;
    description: string;
    basePrice: number;
    inStock: boolean;
    _destroy?: boolean;
}