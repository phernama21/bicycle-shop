import { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import { Rule } from '@/models/rule/domain/rule';
import { Component } from '@/models/component/domain/component';
import { Product } from '@/models/product/domain/product';

interface RuleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ruleData: any) => void;
  currentRule: Rule | null;
  components: Component[];
  products: Product[];
}

export default function RuleDetailsModal({
  isOpen,
  onClose,
  onSave,
  currentRule,
  components,
  products
}: RuleDetailsModalProps) {
  const [error, setError] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const [selectedComponentConditionId, setSelectedComponentConditionId] = useState<number | undefined>(undefined);
  const [selectedOptionConditionId, setSelectedOptionConditionId] = useState<number | undefined>(undefined);
  const [selectedComponentEffectId, setSelectedComponentEffectId] = useState<number | undefined>(undefined);
  const [selectedOptionEffectId, setSelectedOptionEffectId] = useState<number | undefined>(undefined);
  const [selectedEffectType, setSelectedEffectType] = useState<'require' | 'exclude' | 'conditional_price'>('require');
  const [priceAdjustment, setPriceAdjustment] = useState<number>(0);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);

  useEffect(() => {
    if (currentRule) {
      setSelectedProductId(currentRule.product?.id);
      setSelectedComponentConditionId(currentRule.componentCondition?.id);
      setSelectedOptionConditionId(currentRule.optionCondition?.id);
      setSelectedComponentEffectId(currentRule.componentEffect?.id);
      setSelectedOptionEffectId(currentRule.optionEffect?.id);
      setSelectedEffectType(currentRule.effectType);
      setPriceAdjustment(currentRule.priceAdjustment);
    } else {
      setSelectedProductId(undefined);
      setSelectedComponentConditionId(undefined);
      setSelectedOptionConditionId(undefined);
      setSelectedComponentEffectId(undefined);
      setSelectedOptionEffectId(undefined);
      setSelectedEffectType('require');
      setPriceAdjustment(0);
    }
    setError('');
  }, [currentRule, isOpen]);

  useEffect(() => {
    if (!selectedProductId) {
      setFilteredComponents([]);
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (product && product.components.length > 0) {
      const productComponentIds = product.components.map(c => c.id);
      const filteredComps = components.filter(comp => productComponentIds.includes(comp.id));
      setFilteredComponents(filteredComps);
    } else {
      setFilteredComponents([]);
    }
  }, [selectedProductId, components, products]);

  useEffect(() => {
    setSelectedComponentConditionId(undefined);
    setSelectedOptionConditionId(undefined);
    setSelectedComponentEffectId(undefined);
    setSelectedOptionEffectId(undefined);
  }, [selectedProductId]);

  const findComponentById = (id: number | undefined) => {
    if (!id) return undefined;
    return components.find(comp => comp.id === id);
  };

  const getOptionsForComponent = (componentId: number | undefined) => {
    if (!componentId) return [];
    const component = findComponentById(componentId);
    return component?.options || [];
  };

  const handleSaveRule = () => {
    if (!selectedProductId) {
      setError('You must select a product');
      return;
    }
    
    if (!selectedComponentConditionId || !selectedOptionConditionId || 
        !selectedComponentEffectId || !selectedOptionEffectId) {
      setError('All fields are required');
      return;
    }

    const ruleData = {
      productId: selectedProductId,
      componentConditionId: selectedComponentConditionId,
      optionConditionId: selectedOptionConditionId,
      componentEffectId: selectedComponentEffectId,
      optionEffectId: selectedOptionEffectId,
      effectType: selectedEffectType,
      priceAdjustment: selectedEffectType === 'conditional_price' ? priceAdjustment : 0
    };

    onSave(ruleData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentRule ? "Edit Rule" : "Create New Rule"}
    >
      <div className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product <span className="text-red-500">*</span>
          </label>
          <select
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
              error && !selectedProductId ? 'border-red-500' : 'border-gray-400'
            } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
            value={selectedProductId || ''}
            onChange={(e) => {
              const id = e.target.value ? parseInt(e.target.value) : undefined;
              setSelectedProductId(id);
              if (id) {
                setError('');
              }
            }}
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Component Condition <span className="text-red-500">*</span>
          </label>
          <select
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
              error && !selectedComponentConditionId ? 'border-red-500' : 'border-gray-400'
            } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
            value={selectedComponentConditionId || ''}
            onChange={(e) => {
              const id = e.target.value ? parseInt(e.target.value) : undefined;
              setSelectedComponentConditionId(id);
              setSelectedOptionConditionId(undefined);
            }}
            disabled={!selectedProductId}
          >
            <option value="">Select a component</option>
            {filteredComponents.map((component) => (
              <option key={component.id} value={component.id}>
                {component.name}
              </option>
            ))}
          </select>
          {!selectedProductId && (
            <p className="mt-1 text-xs text-amber-500">
              Please select a product first
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Option Condition <span className="text-red-500">*</span>
          </label>
          <select
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
              error && !selectedOptionConditionId ? 'border-red-500' : 'border-gray-400'
            } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
            value={selectedOptionConditionId || ''}
            onChange={(e) => setSelectedOptionConditionId(e.target.value ? parseInt(e.target.value) : undefined)}
            disabled={!selectedComponentConditionId}
          >
            <option value="">Select an option</option>
            {getOptionsForComponent(selectedComponentConditionId).map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Component Effect <span className="text-red-500">*</span>
          </label>
          <select
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
              error && !selectedComponentEffectId ? 'border-red-500' : 'border-gray-400'
            } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
            value={selectedComponentEffectId || ''}
            onChange={(e) => {
              const id = e.target.value ? parseInt(e.target.value) : undefined;
              setSelectedComponentEffectId(id);
              setSelectedOptionEffectId(undefined);
            }}
            disabled={!selectedProductId}
          >
            <option value="">Select a component</option>
            {filteredComponents.map((component) => (
              <option key={component.id} value={component.id}>
                {component.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Option Effect <span className="text-red-500">*</span>
          </label>
          <select
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
              error && !selectedOptionEffectId ? 'border-red-500' : 'border-gray-400'
            } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
            value={selectedOptionEffectId || ''}
            onChange={(e) => setSelectedOptionEffectId(e.target.value ? parseInt(e.target.value) : undefined)}
            disabled={!selectedComponentEffectId}
          >
            <option value="">Select an option</option>
            {getOptionsForComponent(selectedComponentEffectId).map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Effect Type <span className="text-red-500">*</span>
          </label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={selectedEffectType}
            onChange={(e) => setSelectedEffectType(e.target.value as 'require' | 'exclude' | 'conditional_price')}
            disabled={!selectedProductId}
          >
            <option value="require">Require</option>
            <option value="exclude">Exclude</option>
            <option value="conditional_price">Conditional Price</option>
          </select>
        </div>

        {selectedEffectType === 'conditional_price' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price Adjustment (€) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={priceAdjustment}
              onFocus={(e) => {
                if (priceAdjustment === 0) {
                  e.target.value = '';
                }
              }}
              onChange={(e) => {
                if (e.target.value === '' || e.target.value === '-') {
                  setPriceAdjustment(0);
                } else {
                  setPriceAdjustment(parseFloat(e.target.value) || 0);
                }
              }}
              disabled={!selectedProductId}
            />
          </div>
        )}

        <div className="mt-5 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleSaveRule}
          >
            {currentRule ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </Modal>
  );
}