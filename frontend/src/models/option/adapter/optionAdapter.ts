import { Option } from "@/models/option/domain/option";

export const singleOption = (optionData: any): Option => {
    return {
        id: optionData.id,
        name: optionData.name,
        description: optionData.description,
        basePrice: parseFloat(optionData.base_price),
        inStock: optionData.in_stock,
    }
}