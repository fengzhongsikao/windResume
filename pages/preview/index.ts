import { useResumeStore } from '../../stores/resume';
import {
  CANVAS_LOGICAL_WIDTH,
  drawResumeToCanvas,
  estimateResumeHeight,
} from '../../utils/resumeCanvas';
import { getFallbackResumeRect, queryResumeContainerRect } from '../../utils/captureResume';
import { base64ToUint8Array, buildPdfFromJpeg } from '../../utils/imageToPdf';

const EXPORT_DPR = 2;

Page({
  data: {
    basicInfo: { name: '', age: '', email: '', phone: '', avatar: '' },
    modules: [] as any[],
    selectedTemplate: 0,
    avatarText: '',
    canvasWidth: CANVAS_LOGICAL_WIDTH,
    canvasHeight: 1200,
    canvasReady: false,
    isExporting: false,
    scrollTop: 0,
  },

  onShow() {
    const state = useResumeStore.getState();
    this.setData({
      basicInfo: { ...state.basicInfo },
      modules: state.modules,
      selectedTemplate: state.selectedTemplate,
      avatarText: state.basicInfo.name ? state.basicInfo.name.charAt(0) : '?',
    });
  },

  goBack() {
    my.navigateBack();
  },

  goToEdit() {
    my.navigateTo({ url: '/pages/edit/index' });
  },

  goToStyle() {
    my.navigateTo({ url: '/pages/style/index' });
  },

  onSaveToAlbum() {
    this.exportResume('album');
  },

  onSavePdf() {
    this.exportResume('pdf');
  },

  async exportResume(mode: 'album' | 'pdf') {
    if (this.data.isExporting) return;

    const { basicInfo, modules, selectedTemplate, avatarText } = this.data;

    await new Promise<void>((resolve) => {
      this.setData({ scrollTop: 0 }, () => setTimeout(resolve, 80));
    });

    let resumeRect;
    try {
      resumeRect = await queryResumeContainerRect();
    } catch {
      resumeRect = getFallbackResumeRect();
    }

    const exportScale = resumeRect.width / CANVAS_LOGICAL_WIDTH;
    const estimatedLogicalH = estimateResumeHeight(
      basicInfo,
      modules,
      selectedTemplate,
    );
    const destWidth = Math.round(resumeRect.width * EXPORT_DPR);
    const logicalCanvasH = Math.ceil(estimatedLogicalH);

    my.showLoading({ content: mode === 'pdf' ? '正在生成 PDF...' : '正在生成图片...' });

    const self = this;
    this.setData({
      isExporting: true,
      canvasReady: false,
    }, () => {
      self.setData({
        canvasWidth: CANVAS_LOGICAL_WIDTH,
        canvasHeight: logicalCanvasH,
        canvasReady: true,
      }, () => {
        setTimeout(() => {
          self.renderAndExportCanvas(
            mode,
            basicInfo,
            modules,
            selectedTemplate,
            avatarText,
            exportScale,
            destWidth,
            logicalCanvasH,
          );
        }, 200);
      });
    });
  },

  renderAndExportCanvas(
    mode: 'album' | 'pdf',
    basicInfo: any,
    modules: any[],
    selectedTemplate: number,
    avatarText: string,
    exportScale: number,
    destWidth: number,
    logicalCanvasH: number,
  ) {
    const self = this;

    const ctx = my.createCanvasContext('pdfCanvas');
    const finalLogicalY = drawResumeToCanvas(
      ctx,
      basicInfo,
      modules,
      selectedTemplate,
      avatarText,
    );

    const logicalExportH = Math.ceil(finalLogicalY);
    const destHeight = Math.ceil(finalLogicalY * exportScale * EXPORT_DPR);

    ctx.draw(false, () => {
      setTimeout(() => {
        my.canvasToTempFilePath({
          canvasId: 'pdfCanvas',
          x: 0,
          y: 0,
          width: CANVAS_LOGICAL_WIDTH,
          height: logicalExportH,
          destWidth,
          destHeight,
          fileType: 'jpg',
          quality: 1,
          success: (res: any) => {
            self.setData({ canvasReady: false });
            if (mode === 'album') {
              self.saveImageToAlbum(res.tempFilePath);
            } else {
              self.savePdfToPhone(res.tempFilePath, destWidth, destHeight);
            }
          },
          fail: () => {
            my.hideLoading();
            my.showToast({ content: '生成失败，请重试', type: 'fail' });
            self.setData({ isExporting: false, canvasReady: false });
          },
        });
      }, 300);
    });
  },

  saveImageToAlbum(tempFilePath: string) {
    const self = this;
    my.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: () => {
        my.hideLoading();
        my.showToast({ content: '已保存到手机相册', type: 'success' });
        self.setData({ isExporting: false });
      },
      fail: (err: any) => {
        my.hideLoading();
        if (err && err.error === 15) {
          my.showToast({ content: '请授权相册访问权限', type: 'fail' });
        } else {
          my.showToast({ content: '保存失败，请重试', type: 'fail' });
        }
        self.setData({ isExporting: false });
      },
    });
  },

  savePdfToPhone(imagePath: string, pixelWidth: number, pixelHeight: number) {
    const self = this;
    const fs = my.getFileSystemManager();

    fs.readFile({
      filePath: imagePath,
      encoding: 'base64',
      success: (readRes: any) => {
        try {
          const jpegBytes = base64ToUint8Array(readRes.data);
          const pdfBuffer = buildPdfFromJpeg(jpegBytes, pixelWidth, pixelHeight);
          const pdfPath = `${my.env.USER_DATA_PATH}/resume_${Date.now()}.pdf`;

          fs.writeFile({
            filePath: pdfPath,
            data: pdfBuffer,
            success: () => {
              my.saveFileToDisk({
                apFilePath: pdfPath,
                filePath: pdfPath,
                success: () => {
                  my.hideLoading();
                  my.showToast({ content: 'PDF 已保存到手机', type: 'success' });
                  self.setData({ isExporting: false });
                },
                fail: () => {
                  my.hideLoading();
                  my.showToast({ content: '保存 PDF 失败，请重试', type: 'fail' });
                  self.setData({ isExporting: false });
                },
              });
            },
            fail: () => {
              my.hideLoading();
              my.showToast({ content: '生成 PDF 失败', type: 'fail' });
              self.setData({ isExporting: false });
            },
          });
        } catch {
          my.hideLoading();
          my.showToast({ content: '生成 PDF 失败', type: 'fail' });
          self.setData({ isExporting: false });
        }
      },
      fail: () => {
        my.hideLoading();
        my.showToast({ content: '读取图片失败', type: 'fail' });
        self.setData({ isExporting: false });
      },
    });
  },
});
