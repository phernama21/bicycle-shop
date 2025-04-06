import { singleComponent } from "@/models/component/adapter/componentAdapter";
import { Product } from "../domain/product";

export const singleProduct = (productData: any): Product => {
  return {
    id: productData.id,
    name: productData.name,
    description: productData.description,
    image_url: productData.image_url || null,
    components: productData.components.map((component: any) => {
      return singleComponent(component)
    })
  };
}

export const multipleProduct = (productsData: any[]): Product[] => {
  if (Array.isArray(productsData)) {
    const products = productsData.map((product) => {
      if (product?.id === undefined) {
        throw new Error('Product has no id.')
      } else {
        return singleProduct(product);
      }
    })
    return products
  } else {
    return []
  }
}

export const updateProduct = (product: Product): any => {
  const formData = new FormData();
  
  formData.append('product[name]', product.name);
  if (product.description) {
    formData.append('product[description]', product.description);
  }
  
  if (product.image instanceof File) {
    formData.append('product[image]', product.image);
  }
  
  product.components.forEach((component, cIndex) => {
    const componentPrefix = `product[components_attributes][${cIndex}]`;
    
    if (component.id) {
      formData.append(`${componentPrefix}[id]`, component.id.toString());
    }
    
    formData.append(`${componentPrefix}[name]`, component.name);
    
    if (component.description) {
      formData.append(`${componentPrefix}[description]`, component.description);
    }
    
    formData.append(`${componentPrefix}[required]`, component.required ? 'true' : 'false');
    
    if (component._destroy) {
      formData.append(`${componentPrefix}[_destroy]`, 'true');
    }
    
    component.options.forEach((option, oIndex) => {
      const optionPrefix = `${componentPrefix}[options_attributes][${oIndex}]`;
      
      if (option.id) {
        formData.append(`${optionPrefix}[id]`, option.id.toString());
      }
      
      formData.append(`${optionPrefix}[name]`, option.name);
      
      if (option.description) {
        formData.append(`${optionPrefix}[description]`, option.description);
      }
      
      formData.append(`${optionPrefix}[base_price]`, option.basePrice.toString());
      formData.append(`${optionPrefix}[in_stock]`, option.inStock ? 'true' : 'false');
      
      if (option._destroy) {
        formData.append(`${optionPrefix}[_destroy]`, 'true');
      }
    });
  });
  
  return formData;
}