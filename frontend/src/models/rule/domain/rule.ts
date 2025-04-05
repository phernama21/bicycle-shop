import { Component } from "@/models/component/domain/component";
import { Option } from "@/models/option/domain/option";

export interface Rule {
    id: number;
    effectType: 'require' | 'exclude' | 'conditional_price';
    priceAdjustment: number;
    componentCondition?: Component;
    optionCondition?: Option;
    componentEffect?: Component;
    optionEffect?: Option;
  }

  export interface newRule {
    componentConditionId: number;
    optionConditionId: number;
    componentEffectId : number;
    optionEffectId : number;
    effectType: 'require' | 'exclude' | 'conditional_price';
    priceAdjustment: number;
  }