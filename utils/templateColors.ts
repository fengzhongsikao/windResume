export interface TemplateColor {
  headerBg: string;
  headerEnd: string;
  nameColor: string;
  contactBg: string;
  contactColor: string;
  avatarBg: string;
  avatarColor: string;
  dotColor: string;
  titleColor: string;
  tagBg: string;
  tagColor: string;
  tagBorder?: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  bodyBorder?: string;
  layout: 'vertical' | 'sidebar';
  sidebarWidth?: number;
  headerGradientAngle?: number;
}

export const TEMPLATE_COLORS: Record<number, TemplateColor> = {
  0: {
    headerBg: '#1a73e8', headerEnd: '#4285f4',
    nameColor: '#ffffff', contactBg: 'rgba(255,255,255,0.2)', contactColor: '#ffffff',
    avatarBg: 'rgba(255,255,255,0.3)', avatarColor: '#ffffff',
    dotColor: '#1a73e8', titleColor: '#1a73e8',
    tagBg: '#e8f0fe', tagColor: '#1a73e8',
    textPrimary: '#333333', textSecondary: '#666666', textTertiary: '#555555',
    layout: 'vertical', headerGradientAngle: 135,
  },
  1: {
    headerBg: '#ffffff', headerEnd: '#ffffff',
    nameColor: '#1a1a1a', contactBg: '#f5f5f5', contactColor: '#666666',
    avatarBg: '#f0f0f0', avatarColor: '#999999',
    dotColor: '#333333', titleColor: '#1a1a1a',
    tagBg: '#f5f5f5', tagColor: '#333333',
    textPrimary: '#1a1a1a', textSecondary: '#888888', textTertiary: '#666666',
    layout: 'vertical',
  },
  2: {
    headerBg: '#2c2c2c', headerEnd: '#2c2c2c',
    nameColor: '#ffffff', contactBg: 'rgba(255,255,255,0.15)', contactColor: '#dddddd',
    avatarBg: 'rgba(255,255,255,0.2)', avatarColor: '#ffffff',
    dotColor: '#2c2c2c', titleColor: '#2c2c2c',
    tagBg: '#f0f0f0', tagColor: '#2c2c2c',
    textPrimary: '#2c2c2c', textSecondary: '#777777', textTertiary: '#555555',
    bodyBorder: '#2c2c2c',
    layout: 'vertical',
  },
  3: {
    headerBg: '#7c3aed', headerEnd: '#a78bfa',
    nameColor: '#ffffff', contactBg: 'rgba(255,255,255,0.2)', contactColor: '#ffffff',
    avatarBg: 'rgba(255,255,255,0.3)', avatarColor: '#ffffff',
    dotColor: '#7c3aed', titleColor: '#7c3aed',
    tagBg: '#f3e8ff', tagColor: '#7c3aed',
    textPrimary: '#333333', textSecondary: '#888888', textTertiary: '#666666',
    layout: 'vertical', headerGradientAngle: 135,
  },
  4: {
    headerBg: '#059669', headerEnd: '#34d399',
    nameColor: '#ffffff', contactBg: 'rgba(255,255,255,0.2)', contactColor: '#ffffff',
    avatarBg: 'rgba(255,255,255,0.3)', avatarColor: '#ffffff',
    dotColor: '#059669', titleColor: '#059669',
    tagBg: '#ecfdf5', tagColor: '#059669',
    textPrimary: '#333333', textSecondary: '#888888', textTertiary: '#666666',
    layout: 'vertical', headerGradientAngle: 135,
  },
  5: {
    headerBg: '#ea580c', headerEnd: '#fb923c',
    nameColor: '#ffffff', contactBg: 'rgba(255,255,255,0.2)', contactColor: '#ffffff',
    avatarBg: 'rgba(255,255,255,0.3)', avatarColor: '#ffffff',
    dotColor: '#ea580c', titleColor: '#ea580c',
    tagBg: '#fff7ed', tagColor: '#ea580c',
    textPrimary: '#333333', textSecondary: '#888888', textTertiary: '#666666',
    layout: 'vertical', headerGradientAngle: 135,
  },
  6: {
    headerBg: '#4b5563', headerEnd: '#4b5563',
    nameColor: '#ffffff', contactBg: 'rgba(255,255,255,0.1)', contactColor: '#dddddd',
    avatarBg: 'rgba(255,255,255,0.2)', avatarColor: '#ffffff',
    dotColor: '#4b5563', titleColor: '#4b5563',
    tagBg: '#f3f4f6', tagColor: '#4b5563',
    textPrimary: '#333333', textSecondary: '#888888', textTertiary: '#666666',
    layout: 'sidebar', sidebarWidth: 240,
  },
  7: {
    headerBg: '#b45309', headerEnd: '#d97706',
    nameColor: '#ffffff', contactBg: 'rgba(255,255,255,0.15)', contactColor: '#fef3c7',
    avatarBg: 'rgba(255,255,255,0.25)', avatarColor: '#fef3c7',
    dotColor: '#b45309', titleColor: '#b45309',
    tagBg: '#fef3c7', tagColor: '#b45309',
    textPrimary: '#333333', textSecondary: '#888888', textTertiary: '#666666',
    layout: 'vertical', headerGradientAngle: 135,
  },
  8: {
    headerBg: '#ffffff', headerEnd: '#ffffff',
    nameColor: '#1a1a1a', contactBg: 'transparent', contactColor: '#999999',
    avatarBg: '#f0f0f0', avatarColor: '#cccccc',
    dotColor: '#1a1a1a', titleColor: '#1a1a1a',
    tagBg: 'transparent', tagColor: '#555555', tagBorder: '#eeeeee',
    textPrimary: '#1a1a1a', textSecondary: '#aaaaaa', textTertiary: '#888888',
    layout: 'vertical',
  },
  9: {
    headerBg: '#1e3a5f', headerEnd: '#1e3a5f',
    nameColor: '#ffffff', contactBg: 'rgba(255,255,255,0.1)', contactColor: '#dddddd',
    avatarBg: 'rgba(255,255,255,0.2)', avatarColor: '#ffffff',
    dotColor: '#1e3a5f', titleColor: '#1e3a5f',
    tagBg: '#e8edf3', tagColor: '#1e3a5f',
    textPrimary: '#333333', textSecondary: '#888888', textTertiary: '#666666',
    layout: 'sidebar', sidebarWidth: 280,
  },
};

export function getTemplateColors(templateId: number): TemplateColor {
  return TEMPLATE_COLORS[templateId] || TEMPLATE_COLORS[0];
}
