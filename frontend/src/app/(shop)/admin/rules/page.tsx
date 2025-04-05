'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Plus, Pencil, Trash2 } from 'lucide-react';

import { Component } from '@/models/component/domain/component';
import { Rule } from '@/models/rule/domain/rule';
import Modal from '@/components/ui/modal';
import { ruleRepository } from '@/models/rule/infrastructure/ruleRepository';
import { componentRepository } from '@/models/component/infrastructre/componentRepository';
import { useAlert } from '@/contexts/AlertContext';
import { useRouter } from 'next/navigation';
import RuleDetailsModal from '@/components/rules/ruleDetailsModal';

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState<keyof Rule | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);
  const { showAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allRules = await ruleRepository.getAllRules();
        const allComponents = await componentRepository.getAllComponents();
        setRules(allRules);
        setComponents(allComponents);
      } catch (err) {
        showAlert('error', 'Load Error', 'Failed to load rules data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (field: keyof Rule) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRules = () => {
    if (!sortField) return rules;
    
    return [...rules].sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'componentCondition') {
        aValue = a.componentCondition?.name || '';
        bValue = b.componentCondition?.name || '';
      } else if (sortField === 'optionCondition') {
        aValue = a.optionCondition?.name || '';
        bValue = b.optionCondition?.name || '';
      } else if (sortField === 'componentEffect') {
        aValue = a.componentEffect?.name || '';
        bValue = b.componentEffect?.name || '';
      } else if (sortField === 'optionEffect') {
        aValue = a.optionEffect?.name || '';
        bValue = b.optionEffect?.name || '';
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleCreateRule = () => {
    setCurrentRule(null);
    setIsModalOpen(true);
  };

  const handleEditRule = (rule: Rule) => {
    setCurrentRule(rule);
    setIsModalOpen(true);
  };

  const handleDeleteRule = (rule: Rule) => {
    setCurrentRule(rule);
    setIsDeleteModalOpen(true);
  };

  const saveRule = async (ruleData: any) => {
    try {
      let result: { rule?: Rule; error?: string[] };
      if (currentRule) {
        result = await ruleRepository.updateRule(ruleData, currentRule.id);
        if (result.rule) {
          setRules(rules.map(r => r.id === currentRule.id ? result.rule! : r));
          showAlert('success', 'Success!', 'Rule updated successfully.');
        } else if (result.error) {
          showAlert('error', 'Error', result.error.join(', '));
        }
      } else {
        result = await ruleRepository.createRule(ruleData);
        if (result.rule) {
          setRules([...rules, result.rule]);
          showAlert('success', 'Success!', 'Rule created successfully.');
        } else if (result.error) {
          showAlert('error', 'Error', result.error.join(', '));
        }
      }

      setIsModalOpen(false);
    } catch (err: any) {
      showAlert('error', 'Error', err.response?.data?.message || 'Failed to save rule');
      console.error("ERROR",err);
    }
  };

  const handleBackClick = () => {
    router.push("/admin/dashboard");
  };

  const confirmDeleteRule = async () => {
    if (!currentRule) return;
    
    try {
      const success = await ruleRepository.deleteRule(currentRule.id);
      if(success){
        setRules(rules.filter(r => r.id !== currentRule.id));
        showAlert('success', 'Success!', 'Rule deleted successfully.');
      }else{
        showAlert('error', 'Error',"Couldn't delete rule");
      }
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('Failed to delete rule');
      console.error(err);
    }
  };

  const getSortIcon = (field: keyof Rule) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 inline" /> : <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className='flex flex-row'>
        <button 
            onClick={handleBackClick}
            className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back to dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-600"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        <h1 className="text-2xl font-bold text-indigo-600">Rules Configuration</h1>
        </div>
      
        <button 
          onClick={handleCreateRule} 
          className="bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Rule
        </button>
      </div>
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-indigo-600"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-2 text-sm text-indigo-600">Rules Management</span>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('componentCondition')}
              >
                <div className="flex items-center">
                  Component Condition
                  {getSortIcon('componentCondition')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('optionCondition')}
              >
                <div className="flex items-center">
                  Option Condition
                  {getSortIcon('optionCondition')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('componentEffect')}
              >
                <div className="flex items-center">
                  Component Effect
                  {getSortIcon('componentEffect')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('optionEffect')}
              >
                <div className="flex items-center">
                  Option Effect
                  {getSortIcon('optionEffect')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('effectType')}
              >
                <div className="flex items-center">
                  Effect Type
                  {getSortIcon('effectType')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('priceAdjustment')}
              >
                <div className="flex items-center">
                  Price Adjustment
                  {getSortIcon('priceAdjustment')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRules().map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {rule.componentCondition?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {rule.optionCondition?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {rule.componentEffect?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {rule.optionEffect?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    rule.effectType === 'require' ? 'bg-green-100 text-green-800' :
                    rule.effectType === 'exclude' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {rule.effectType.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {rule.effectType === 'conditional_price' ? 
                    `${rule.priceAdjustment.toFixed(2)}€` : 
                    'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditRule(rule)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteRule(rule)}
                      className="text-red-700 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No rules found. Create a new rule to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RuleDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveRule}
        currentRule={currentRule}
        components={components}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this rule? This action cannot be undone.
          </p>
          <div className="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={confirmDeleteRule}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}