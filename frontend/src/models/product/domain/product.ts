import { Component } from "@/models/component/domain/component";

export interface Product {
    id: number;
    name: string;
    description: string;
    components: Component[]
}