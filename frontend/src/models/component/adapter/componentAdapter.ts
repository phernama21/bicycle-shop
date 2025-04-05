import { Component } from "@/models/component/domain/component";
import { singleOption } from "@/models/option/adapter/optionAdapter";

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

export const multiple = (componentData: any): Component[] => {
  if(Array.isArray(componentData)){
    const components = componentData.map((component) => {
      if(component?.id === undefined){
        throw new Error('Rule has no id.')
      }else{
        return singleComponent(component);
      }
    })
    return components
  }else{
    return []
  }
}