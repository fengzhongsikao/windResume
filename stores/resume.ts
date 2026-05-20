import { create } from 'zustand';
import {
  BasicInfo,
  ModuleItem,
  ModuleType,
  createEmptyBasicInfo,
  createEmptyModuleData,
  generateId,
  MODULE_CONFIGS,
} from '../types/resume';

interface ResumeState {
  basicInfo: BasicInfo;
  modules: ModuleItem[];
  selectedTemplate: number;

  setBasicInfo: (info: Partial<BasicInfo>) => void;
  addModule: (type: ModuleType) => void;
  removeModule: (id: string) => void;
  updateModuleData: (id: string, data: ModuleItem['data']) => void;
  reorderModules: (fromIndex: number, toIndex: number) => void;
  setSelectedTemplate: (templateId: number) => void;
  resetAll: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  basicInfo: createEmptyBasicInfo(),
  modules: [],
  selectedTemplate: 0,

  setBasicInfo: (info) =>
    set((state) => ({
      basicInfo: { ...state.basicInfo, ...info },
    })),

  addModule: (type) => {
    const config = MODULE_CONFIGS.find((c) => c.type === type);
    if (!config) return;
    set((state) => ({
      modules: [
        ...state.modules,
        {
          id: generateId(),
          type,
          label: config.label,
          icon: config.icon,
          data: createEmptyModuleData(type),
        },
      ],
    }));
  },

  removeModule: (id) =>
    set((state) => ({
      modules: state.modules.filter((m) => m.id !== id),
    })),

  updateModuleData: (id, data) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id ? { ...m, data } : m
      ),
    })),

  reorderModules: (fromIndex, toIndex) =>
    set((state) => {
      const modules = [...state.modules];
      const [removed] = modules.splice(fromIndex, 1);
      modules.splice(toIndex, 0, removed);
      return { modules };
    }),

  setSelectedTemplate: (templateId) =>
    set({ selectedTemplate: templateId }),

  resetAll: () =>
    set({
      basicInfo: createEmptyBasicInfo(),
      modules: [],
      selectedTemplate: 0,
    }),
}));
