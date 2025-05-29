import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface InitialState {
  courseEditor: {
    sections: Section[];
    isSectionModalOpen: boolean;
    isLessonModalOpen: boolean;
    selectedLesson: Lesson | null | undefined;
    selectedSection: Section | null | undefined;
  };
  uploadProgress: {
    isProgressModalOpen: boolean;
    isUploading: boolean;
    totalFiles: number;
    totalProgress: number;
    individualFileProgress: {
      fileName: string;
      progress: number;
    }[];
    currentStep: "uploading_files" | "uploading_image" | "updating_course";
  };
}

interface CourseStore extends InitialState {
  setSections: (section: Section[]) => void;
  openSectionModal: (mode: "add" | "edit", selectedSection?: Section) => void;
  closeSectionModal: () => void;
  addSection: (section: Section) => void;
  updateSection: (sectionId: string, section: Section) => void;
  deleteSection: (sectionId: string) => void;
  addLesson: (sectionId: string, lesson: Lesson) => void;
  updateLesson: (
    sectionId: string,
    lessonId: string,
    lesson: Partial<Lesson>,
  ) => void;
  deleteLesson: (sectionId: string, lessonId: string) => void;
  openLessonModal: (
    mode: "add" | "edit",
    selectedSection?: Section,
    selectedLesson?: Lesson,
  ) => void;
  closeLessonModal: () => void;
  setTotalFiles: (totalFiles: number) => void;
  setTotalProgress: (progress: number) => void;
  setCourseUploading: (status: boolean) => void;
  updateIndividualFileProgress: (fileName: string, progress: number) => void;
  setCurrentStep: (
    step: "uploading_files" | "uploading_image" | "updating_course",
  ) => void;
  resetUploadProgress: () => void;
  openProgressModal: () => void;
  closeProgressModal: () => void;
}

const initialState: InitialState = {
  courseEditor: {
    sections: [],
    isLessonModalOpen: false,
    isSectionModalOpen: false,
    selectedSection: null,
    selectedLesson: null,
  },
  uploadProgress: {
    isProgressModalOpen: false,
    isUploading: false,
    totalFiles: 0,
    totalProgress: 0,
    individualFileProgress: [],
    currentStep: "uploading_files",
  },
};

export const useCourseStore = create<CourseStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,
        setSections: (sections) =>
          set((state) => {
            state.courseEditor.sections = sections;
          }),
        openSectionModal: (mode, selectedSection) =>
          set((state) => {
            state.courseEditor.isSectionModalOpen = true;
            state.courseEditor.selectedSection =
              mode === "edit" ? selectedSection : null;
          }),
        closeSectionModal: () =>
          set((state) => {
            state.courseEditor.isSectionModalOpen = false;
            state.courseEditor.selectedSection = null;
          }),
        addSection: (section) =>
          set((state) => {
            state.courseEditor.sections.push(section);
          }),
        updateSection: (sectionId, updatedSection) =>
          set((state) => {
            const section = state.courseEditor.sections.find(
              (s) => s.id === sectionId,
            );

            if (section) {
              Object.assign(section, updatedSection);
            }
          }),
        deleteSection: (sectionId) =>
          set((state) => {
            state.courseEditor.sections = state.courseEditor.sections.filter(
              (s) => s.id !== sectionId,
            );
          }),
        openLessonModal: (mode, selectedSection, selectedLesson) =>
          set((state) => {
            state.courseEditor.isLessonModalOpen = true;
            state.courseEditor.selectedSection =
              mode === "edit"
                ? selectedSection
                : mode === "add"
                  ? selectedSection
                  : null;
            state.courseEditor.selectedLesson =
              mode === "edit" ? selectedLesson : null;
          }),
        closeLessonModal: () =>
          set((state) => {
            state.courseEditor.isLessonModalOpen = false;
            state.courseEditor.selectedSection = null;
            state.courseEditor.selectedLesson = null;
          }),
        addLesson: (sectionId, lesson) =>
          set((state) => {
            const section = state.courseEditor.sections.find(
              (s) => s.id === sectionId,
            );

            if (section) {
              section.lessons.push(lesson);
            }
          }),
        updateLesson: (sectionId, lessonId, updatedLesson) =>
          set((state) => {
            const section = state.courseEditor.sections.find(
              (s) => s.id === sectionId,
            );

            if (section) {
              const lesson = section.lessons.find(
                (lesson) => lesson.id === lessonId,
              );

              if (lesson) {
                Object.assign(lesson, updatedLesson);
              }
            }
          }),
        deleteLesson: (sectionId, lessonId) =>
          set((state) => {
            const section = state.courseEditor.sections.find(
              (section) => section.id === sectionId,
            );

            if (section) {
              section.lessons = section.lessons.filter(
                (lesson) => lesson.id !== lessonId,
              );
            }
          }),
        setTotalFiles: (totalFiles) =>
          set((state) => {
            state.uploadProgress.totalFiles = totalFiles;
          }),
        setTotalProgress: (progress) =>
          set((state) => {
            state.uploadProgress.totalProgress = progress;
          }),
        updateIndividualFileProgress: (fileName, progress) =>
          set((state) => {
            const file = state.uploadProgress.individualFileProgress.find(
              (f) => f.fileName === fileName,
            );

            if (file) {
              file.progress = progress;
            } else {
              state.uploadProgress.individualFileProgress.push({
                fileName,
                progress,
              });
            }
          }),
        setCourseUploading: (status) =>
          set((state) => {
            state.uploadProgress.isUploading = status;
          }),
        setCurrentStep: (step) =>
          set((state) => {
            state.uploadProgress.currentStep = step;
          }),
        resetUploadProgress: () =>
          set((state) => {
            state.uploadProgress = {
              ...initialState.uploadProgress,
              isUploading: true,
              isProgressModalOpen: true,
            };
          }),
        openProgressModal: () =>
          set((state) => {
            state.uploadProgress.isProgressModalOpen = true;
          }),
        closeProgressModal: () =>
          set((state) => {
            state.uploadProgress.isProgressModalOpen = false;
          }),
      })),
      {
        name: "course-store",
      },
    ),
    {
      name: "CourseStore",
    },
  ),
);
