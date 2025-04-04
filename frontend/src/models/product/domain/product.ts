export interface Product {
    id: number;
    name: string;
    description: string;
    components: Component[]
}

export interface Component {
    id?: number;
    name: string;
    description: string;
    required: boolean;
    options: Option[];
    _destroy?: boolean;
}

export interface Option {
    id?: number;
    name: string;
    description: string;
    basePrice: number;
    inStock: boolean;
    _destroy?: boolean;
}