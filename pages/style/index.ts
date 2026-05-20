import { useResumeStore } from '../../stores/resume';
import { TEMPLATES } from '../../types/resume';

Page({
  data: {
    templates: TEMPLATES,
    selectedTemplate: 0,
  },

  onShow() {
    const state = useResumeStore.getState();
    this.setData({
      selectedTemplate: state.selectedTemplate,
    });
  },

  onSelectTemplate(e: any) {
    const id = e.currentTarget.dataset.id;
    this.setData({ selectedTemplate: id });
  },

  onSaveTemplate() {
    useResumeStore.getState().setSelectedTemplate(this.data.selectedTemplate);
    my.showToast({ content: '样式已保存', type: 'success' });
    setTimeout(() => {
      my.navigateBack();
    }, 1000);
  },
});
