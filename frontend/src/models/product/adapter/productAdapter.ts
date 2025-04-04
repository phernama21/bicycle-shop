import { Component, Product, Option } from "../domain/product";

export const singleProduct = (productData: any): Product => {
  return {
    id: productData.id,
    name: productData.name,
    description: productData.description,
    components: productData.components.map((component:any) =>{
        return singleComponent(component)
    })
  };
};

export const singleComponent = (componentData: any): Component => {
    return {
        id: componentData.id,
        name: componentData.name,
        description: componentData.description,
        required: componentData.required,
        options: componentData.options.map((option:any) => {
            return singleOption(option)
        })

    }
}

export const updateProduct = (productData: Product): any => {
    return {
            id: productData.id,
            name: productData.name,
            description: productData.description,
            components_attributes: productData.components.map(component => ({
                id: component.id || undefined,
                name: component.name,
                description: component.description,
                required: component.required,
                _destroy: component._destroy || false,
                options_attributes: component.options.map(option => ({
                    id: option.id || undefined,
                    name: option.name,
                    description: option.description,
                    base_price: option.basePrice,
                    in_stock: option.inStock,
                    _destroy: option._destroy || false,
                })),
            })),
    }
}

export const singleOption = (optionData: any): Option => {
    return {
        id: optionData.id,
        name: optionData.name,
        description: optionData.description,
        basePrice: optionData.base_price,
        inStock: optionData.in_stock,
    }
}
