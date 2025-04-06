import { Component } from "@/models/component/domain/component";
import { Option } from "@/models/option/domain/option";
import { Product, ProductReduced } from "@/models/product/domain/product";

export interface Rule {
  id: number;
  effectType: 'require' | 'exclude' | 'conditional_price';
  priceAdjustment: number;
  product?: ProductReduced;
  componentCondition?: Component;
  optionCondition?: Option;
  componentEffect?: Component;
  optionEffect?: Option;
}

export interface newRule {
  productId?: number;
  componentConditionId: number;
  optionConditionId: number;
  componentEffectId: number;
  optionEffectId: number;
  effectType: 'require' | 'exclude' | 'conditional_price';
  priceAdjustment: number;
}