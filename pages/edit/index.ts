import { useResumeStore } from '../../stores/resume';
import { MODULE_CONFIGS, ModuleType, createEmptySkill, createEmptyHobby } from '../../types/resume';

interface SkillItem {
  name: string;
  level?: string;
}

Page({
  data: {
    basicInfo: { name: '', age: '', email: '', phone: '' },
    modules: [] as any[],
    modulePreviews: {} as Record<string, string>,
    availableModules: [] as typeof MODULE_CONFIGS,
    showAddPopup: false,
    showEditPopup: false,
    editingModuleId: '',
    editingModuleType: '' as ModuleType | '',
    editingModuleLabel: '',
    editForm: {} as Record<string, any>,
    editFormSkills: [] as SkillItem[],
    showDatePicker: false,
    datePickerField: '',
    datePickerValue: '',
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const state = useResumeStore.getState();
    const addedTypes = state.modules.map((m) => m.type);
    const available = MODULE_CONFIGS.filter((m) => addedTypes.indexOf(m.type) === -1);

    const previews: Record<string, string> = {};
    state.modules.forEach((m) => {
      previews[m.id] = this.getModulePreview(m);
    });

    this.setData({
      basicInfo: { ...state.basicInfo },
      modules: state.modules,
      modulePreviews: previews,
      availableModules: available,
    });
  },

  getModulePreview(module: any): string {
    const d = module.data;
    switch (module.type) {
      case 'jobIntention':
        return d.position ? `${d.position} ${d.city || ''}` : '未填写';
      case 'education':
        return d.school || '未填写';
      case 'internship':
      case 'workExperience':
        return d.company || '未填写';
      case 'projectExperience':
        return d.name || '未填写';
      case 'skills':
        return Array.isArray(d) && d.length > 0 ? `${d.length} 项技能` : '未填写';
      case 'hobbies':
        return Array.isArray(d) && d.length > 0 ? `${d.length} 个爱好` : '未填写';
      case 'selfEvaluation':
        return d.content ? d.content.slice(0, 20) + '...' : '未填写';
      default:
        return '未填写';
    }
  },

  onBasicInput(e: any) {
    const field = e.target.dataset.field;
    const value = e.detail.value;
    const basicInfo = { ...this.data.basicInfo, [field]: value };
    this.setData({ basicInfo });
    useResumeStore.getState().setBasicInfo({ [field]: value });
  },

  onShowAddPopup() {
    this.loadData();
    this.setData({ showAddPopup: true });
  },

  onCloseAddPopup() {
    this.setData({ showAddPopup: false });
  },

  onSelectModule(e: any) {
    const type = e.target.dataset.type as ModuleType;
    useResumeStore.getState().addModule(type);
    this.setData({ showAddPopup: false });
    this.loadData();
  },

  onEditModule(e: any) {
    const index = e.currentTarget.dataset.index;
    const module = this.data.modules[index];
    if (!module) return;

    let editForm: Record<string, any> = {};
    let editFormSkills: SkillItem[] = [];

    if (module.type === 'skills' || module.type === 'hobbies') {
      editFormSkills = Array.isArray(module.data) ? [...module.data] : [];
    } else {
      editForm = { ...module.data };
    }

    this.setData({
      showEditPopup: true,
      editingModuleId: module.id,
      editingModuleType: module.type,
      editingModuleLabel: module.label,
      editForm,
      editFormSkills,
    });

    if (module.type !== 'skills' && module.type !== 'hobbies') {
      const field = module.type === 'selfEvaluation' ? 'content' : 'description';
      setTimeout(() => {
        (this as any)._textareaRef?.update(editForm[field] || '');
      }, 100);
    }
  },

  handleTextareaRef(ref: any) {
    (this as any)._textareaRef = ref;
  },

  onCloseEditPopup() {
    this.setData({ showEditPopup: false });
  },

  onOpenDatePicker(e: any) {
    const field = e.target.dataset.field;
    const currentValue = this.data.editForm[field] || '';
    this.setData({
      datePickerField: field,
      datePickerValue: currentValue,
      showDatePicker: true,
    });
  },

  onDateOk(date: any, dateStr: string) {
    const field = this.data.datePickerField;
    this.setData({
      editForm: { ...this.data.editForm, [field]: dateStr },
      showDatePicker: false,
    });
  },

  onDateCancel() {
    this.setData({ showDatePicker: false });
  },

  onDateVisibleChange(visible: boolean) {
    if (!visible) {
      this.setData({ showDatePicker: false });
    }
  },

  onEditFormInput(e: any) {
    const field = e.target.dataset.field;
    const value = e.detail.value;
    this.setData({
      editForm: { ...this.data.editForm, [field]: value },
    });
  },

  onTextareaChange(value: string, e: any) {
    const field = e.target.dataset.field;
    this.setData({
      editForm: { ...this.data.editForm, [field]: value },
    });
  },

  onSkillInput(e: any) {
    const index = e.target.dataset.index;
    const field = e.target.dataset.field;
    const value = e.detail.value;
    const skills = [...this.data.editFormSkills];
    skills[index] = { ...skills[index], [field]: value };
    this.setData({ editFormSkills: skills });
  },

  onAddSkill() {
    const skills = [...this.data.editFormSkills];
    if (this.data.editingModuleType === 'skills') {
      skills.push(createEmptySkill());
    } else {
      skills.push(createEmptyHobby());
    }
    this.setData({ editFormSkills: skills });
  },

  onDeleteSkill(e: any) {
    const index = e.target.dataset.index;
    const skills = [...this.data.editFormSkills];
    skills.splice(index, 1);
    if (skills.length === 0) {
      if (this.data.editingModuleType === 'skills') {
        skills.push(createEmptySkill());
      } else {
        skills.push(createEmptyHobby());
      }
    }
    this.setData({ editFormSkills: skills });
  },

  onSaveModule() {
    const { editingModuleId, editingModuleType, editForm, editFormSkills } = this.data;
    let data: any;

    if (editingModuleType === 'skills' || editingModuleType === 'hobbies') {
      data = editFormSkills.filter((s) => s.name.trim());
      if (data.length === 0) {
        my.showToast({ content: '请至少填写一项', type: 'fail' });
        return;
      }
    } else {
      data = editForm;
    }

    useResumeStore.getState().updateModuleData(editingModuleId, data);
    this.setData({ showEditPopup: false });
    this.loadData();
  },

  onDeleteModule(e: any) {
    const index = e.currentTarget.dataset.index;
    const module = this.data.modules[index];
    if (!module) return;

    my.showModal({
      title: '确认删除',
      content: `确定要删除「${module.label}」模块吗？`,
      confirmText: '删除',
      confirmColor: '#ff4d4f',
      success: (res: any) => {
        if (res.confirm) {
          useResumeStore.getState().removeModule(module.id);
          this.loadData();
        }
      },
    });
  },
});
