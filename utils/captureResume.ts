export interface ResumeRect {
  width: number;
  height: number;
}

/** 获取预览区简历节点的实际渲染尺寸（与屏幕所见一致） */
export function queryResumeContainerRect(): Promise<ResumeRect> {
  return new Promise((resolve, reject) => {
    my.createSelectorQuery()
      .select('#resumeContainer')
      .boundingClientRect()
      .exec((ret: any) => {
        const rect = ret && ret[0];
        if (rect && rect.width > 10 && rect.height > 10) {
          resolve({ width: rect.width, height: rect.height });
        } else {
          reject(new Error('无法获取简历区域尺寸'));
        }
      });
  });
}

export function getFallbackResumeRect(): ResumeRect {
  const sys = my.getSystemInfoSync();
  const windowWidth = sys.windowWidth || 375;
  // 与 preview-scroll 左右 padding 24rpx * 2 对齐
  const padding = (48 / 750) * windowWidth;
  return {
    width: windowWidth - padding,
    height: Math.max(800, windowWidth * 1.4),
  };
}
