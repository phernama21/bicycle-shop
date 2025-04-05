import apiClient from "@/lib/api";
import { multiple } from "../adapter/componentAdapter";
import { Component } from "../domain/component";

export const componentRepository = {
    async getAllComponents (): Promise<Component[]> {
        try {
          const response = await apiClient.get('/components');
          return multiple(response.data.components)
        } catch (error) {
          console.error('Get all components error:', error);
          return [];
        }
      },
      
}