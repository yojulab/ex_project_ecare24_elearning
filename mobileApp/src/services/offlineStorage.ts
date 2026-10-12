// Offline Cache and Local Storage Service for Mobile App

export interface OfflineCourseCache {
  courseId: number;
  diseaseCode: string;
  title: string;
  downloadedAt: string;
  fileSizeMb: number;
}

const STORAGE_KEY_OFFLINE = 'ecare24_mobile_offline_courses';
const STORAGE_KEY_EXAM_ANSWERS = 'ecare24_mobile_exam_answers';

export const offlineStorage = {
  getOfflineCourses: (): OfflineCourseCache[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_OFFLINE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    // 기본으로 MVP 01 신경계 과정이 캐싱되어 있다고 가정
    return [
      {
        courseId: 1,
        diseaseCode: '01_NEURO',
        title: '신경계(뇌졸중/편마비) 집중 간병 전문과정',
        downloadedAt: '2026-10-10 14:30',
        fileSizeMb: 42.5,
      },
    ];
  },

  saveOfflineCourse: (item: OfflineCourseCache) => {
    try {
      const list = offlineStorage.getOfflineCourses();
      if (!list.some((c) => c.courseId === item.courseId)) {
        list.push(item);
        localStorage.setItem(STORAGE_KEY_OFFLINE, JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  },

  removeOfflineCourse: (courseId: number) => {
    try {
      const list = offlineStorage.getOfflineCourses().filter((c) => c.courseId !== courseId);
      localStorage.setItem(STORAGE_KEY_OFFLINE, JSON.stringify(list));
    } catch (e) {
      console.warn('Storage remove failed', e);
    }
  },

  saveExamAnswer: (examId: number, answers: Record<number, number>) => {
    try {
      localStorage.setItem(`${STORAGE_KEY_EXAM_ANSWERS}_${examId}`, JSON.stringify(answers));
    } catch (e) {}
  },

  getSavedExamAnswer: (examId: number): Record<number, number> | null => {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_EXAM_ANSWERS}_${examId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  },
};
