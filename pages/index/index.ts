import { useResumeStore } from '../../stores/resume';
import { TEMPLATES } from '../../types/resume';

Page({
  data: {
    hasData: false,
    basicInfo: { name: '' },
    templateName: '',
    moduleCount: 0,
  },

  onShow() {
    const state = useResumeStore.getState();
    const basicInfo = state.basicInfo;
    const template = TEMPLATES.find((t) => t.id === state.selectedTemplate) || TEMPLATES[0];
    this.setData({
      hasData: !!basicInfo.name || state.modules.length > 0,
      basicInfo: { name: basicInfo.name },
      templateName: template.name,
      moduleCount: state.modules.length,
    });
  },

  goToEdit() {
    my.navigateTo({ url: '/pages/edit/index' });
  },

  goToStyle() {
    my.navigateTo({ url: '/pages/style/index' });
  },

  goToPreview() {
    my.navigateTo({ url: '/pages/preview/index' });
  },
});
