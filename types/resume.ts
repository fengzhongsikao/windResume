export interface BasicInfo {
  name: string;
  age: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface JobIntention {
  position: string;
  city: string;
  salary: string;
  type: string;
}

export interface Education {
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Internship {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectExperience {
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  name: string;
  level: string;
}

export interface Hobby {
  name: string;
}

export interface SelfEvaluation {
  content: string;
}

export type ModuleType =
  | 'jobIntention'
  | 'education'
  | 'internship'
  | 'workExperience'
  | 'projectExperience'
  | 'skills'
  | 'hobbies'
  | 'selfEvaluation';

export interface ModuleItem {
  id: string;
  type: ModuleType;
  label: string;
  icon: string;
  data: JobIntention | Education | Internship | WorkExperience | ProjectExperience | Skill[] | Hobby[] | SelfEvaluation;
}

export interface ResumeData {
  basicInfo: BasicInfo;
  modules: ModuleItem[];
  selectedTemplate: number;
}

export const MODULE_CONFIGS: { type: ModuleType; label: string; icon: string }[] = [
  { type: 'jobIntention', label: '求职意向', icon: '🎯' },
  { type: 'education', label: '教育经历', icon: '🎓' },
  { type: 'internship', label: '实习经历', icon: '💼' },
  { type: 'workExperience', label: '工作经历', icon: '🏢' },
  { type: 'projectExperience', label: '项目经历', icon: '🚀' },
  { type: 'skills', label: '技能特长', icon: '⚡' },
  { type: 'hobbies', label: '兴趣爱好', icon: '🎨' },
  { type: 'selfEvaluation', label: '自我评价', icon: '📝' },
];

export const TEMPLATES = [
  { id: 0, name: '经典蓝', color: '#1a73e8', desc: '干净专业的蓝色调' },
  { id: 1, name: '简约白', color: '#f5f5f5', desc: '简洁纯净的白色风格' },
  { id: 2, name: '商务黑', color: '#2c2c2c', desc: '沉稳大气的黑色顶栏' },
  { id: 3, name: '优雅紫', color: '#7c3aed', desc: '优雅的紫色渐变' },
  { id: 4, name: '清新绿', color: '#059669', desc: '清新自然的绿色系' },
  { id: 5, name: '暖橙', color: '#ea580c', desc: '温暖活力的橙色系' },
  { id: 6, name: '科技灰', color: '#4b5563', desc: '现代科技的灰色调' },
  { id: 7, name: '文艺风', color: '#b45309', desc: '典雅文艺的风格' },
  { id: 8, name: '极简风', color: '#ffffff', desc: '极致简约的设计' },
  { id: 9, name: '双栏布局', color: '#1e3a5f', desc: '清晰的双栏结构' },
];

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function createEmptyBasicInfo(): BasicInfo {
  return { name: '', age: '', email: '', phone: '', avatar: '' };
}

export function createEmptyJobIntention(): JobIntention {
  return { position: '', city: '', salary: '', type: '' };
}

export function createEmptyEducation(): Education {
  return { school: '', major: '', degree: '', startDate: '', endDate: '', description: '' };
}

export function createEmptyInternship(): Internship {
  return { company: '', position: '', startDate: '', endDate: '', description: '' };
}

export function createEmptyWorkExperience(): WorkExperience {
  return { company: '', position: '', startDate: '', endDate: '', description: '' };
}

export function createEmptyProjectExperience(): ProjectExperience {
  return { name: '', role: '', startDate: '', endDate: '', description: '' };
}

export function createEmptySkill(): Skill {
  return { name: '', level: '' };
}

export function createEmptyHobby(): Hobby {
  return { name: '' };
}

export function createEmptySelfEvaluation(): SelfEvaluation {
  return { content: '' };
}

export function createEmptyModuleData(type: ModuleType): ModuleItem['data'] {
  switch (type) {
    case 'jobIntention':
      return createEmptyJobIntention();
    case 'education':
      return createEmptyEducation();
    case 'internship':
      return createEmptyInternship();
    case 'workExperience':
      return createEmptyWorkExperience();
    case 'projectExperience':
      return createEmptyProjectExperience();
    case 'skills':
      return [createEmptySkill()];
    case 'hobbies':
      return [createEmptyHobby()];
    case 'selfEvaluation':
      return createEmptySelfEvaluation();
    default:
      return createEmptyJobIntention();
  }
}
