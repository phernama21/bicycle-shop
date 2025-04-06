import { newRule, Rule } from "../domain/rule";


export const single = (ruleData: any): Rule => {
  return {
    id: ruleData.id,
    effectType: ruleData.effect_type,
    priceAdjustment: parseFloat(ruleData.price_adjustment),
    componentCondition: ruleData.component_condition,
    optionCondition: ruleData.option_condition,
    product: ruleData.product,
    componentEffect: ruleData.component_effect,
    optionEffect: ruleData.option_effect,
  }
};

export const multiple = (ruleData: any): Rule[] => {
  if(Array.isArray(ruleData)){
    const rules = ruleData.map((rule) => {
      if(rule?.id === undefined){
        throw new Error('Rule has no id.')
      }else{
        return single(rule);
      }
    })
    return rules
  }else{
    return []
  }
}

export const toBackend = (rule: newRule): any => {
  return {
    product_id: rule.productId,
    component_condition_id: rule.componentConditionId,
    option_condition_id: rule.optionConditionId,
    component_effect_id: rule.componentEffectId,
    option_effect_id: rule.optionEffectId,
    effect_type: rule.effectType,
    price_adjustment: rule.priceAdjustment
  }
}