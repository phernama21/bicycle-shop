import apiClient from "@/lib/api";
import { newRule, Rule } from "../domain/rule";
import { multiple, single, toBackend } from "../adapter/ruleAdapter";


export const ruleRepository = {
  async getAllRules (): Promise<Rule[]> {
    try {
      const response = await apiClient.get('/rules');
      return multiple(response.data.rules)
    } catch (error) {
      console.error('Get all rules error:', error);
      return [];
    }
  },

  async createRule(rule: newRule): Promise<{ rule?: Rule; error?: string[] }> {
    try {
      const response = await apiClient.post('/rules', { rule: toBackend(rule) });
      return { rule: single(response.data.rule) };
    } catch (error: any) {
      if (error.response?.data?.errors) {
        return { error: error.response.data.errors };
      }
      return { error: ['An unexpected error occurred'] };
    }
  },

  async updateRule(rule: newRule, id: number): Promise<{ rule?: Rule; error?: string[] }> {
    try {
      const response = await apiClient.put(`/rules/${id}`, { rule: toBackend(rule) });
      return { rule: single(response.data.rule) };
    } catch (error :any) {
      if (error.response?.data?.errors) {
        return { error: error.response.data.errors };
      }
      return { error: ['An unexpected error occurred'] };
    }
  },

  async deleteRule(id: number): Promise<boolean> {
    const response = await apiClient.delete(`/rules/${id}`)
    return response.status == 204
  }
      
}