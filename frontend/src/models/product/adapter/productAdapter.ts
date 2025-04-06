import { singleComponent } from "@/models/component/adapter/componentAdapter";
import { Product } from "../domain/product";

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

export const multipleProduct= (productsData: any): Product[] => {
  if(Array.isArray(productsData)){
      const products = productsData.map((product) => {
        if(product?.id === undefined){
          throw new Error('Product has no id.')
        }else{
          return singleProduct(product);
        }
      })
      return products
    }else{
      return []
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