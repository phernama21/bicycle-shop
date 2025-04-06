import { Component } from "@/models/component/domain/component";

export interface Product {
    id: number;
    name: string;
    description: string;
    image?: File | null;
    image_url?: string;
    components: Component[]
}

export interface ProductReduced {
    id: number;
    name: string;
}