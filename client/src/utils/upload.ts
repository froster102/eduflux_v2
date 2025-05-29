import axios from "axios";

import { nanoid } from "./nanoid";

import api from "@/lib/axios";

interface SignedUrlResponse {
  fileId: string;
  uploadUrl: string;
  fileUrl: string;
}

interface TotalProgressCallback {
  (progress: number): void;
}

interface IndividualFileProgressCallack {
  (progress: number, fileName: string): void;
}

export async function getSignedUrl(file: {
  fileId: string;
  fileName: string;
  fileType: string;
}): Promise<SignedUrlResponse> {
  try {
    const response = await api.post<SignedUrlResponse>(
      "/courses/uploads/get-signed-url",
      file,
    );

    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to get signed URL: ${error.message}`);
  }
}

export async function uploadFileToSignedUrl(
  file: File,
  signedUrl: string,
  fileUrl: string,
  onProgress?: (progress: number, fileName: string) => void,
): Promise<string> {
  try {
    await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          onProgress(percentCompleted, file.name);
        }
      },
    });

    return fileUrl;
  } catch (error: any) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

export async function getFilesUrlsSections(
  localSections: Section[],
  totalProgressCallback: TotalProgressCallback,
  individualProgressCallback: IndividualFileProgressCallack,
): Promise<SignedUrlResponse[]> {
  const fileUrls: SignedUrlResponse[] = [];
  const filePromises: Promise<void>[] = [];

  let totalFiles = 0;
  let processedFiles = 0;

  localSections.forEach((section) => {
    section.lessons.forEach((lesson) => {
      if (lesson.video instanceof File) {
        totalFiles++;
      }
    });
  });

  localSections.forEach((section) => {
    section.lessons.forEach((lesson) => {
      if (lesson.video instanceof File) {
        const promise = getSignedUrl({
          fileId: lesson.id,
          fileName: lesson.video.name,
          fileType: lesson.video.type,
        })
          .then(async (response) => {
            await uploadFileToSignedUrl(
              lesson.video as File,
              response.uploadUrl,
              response.fileUrl,
              (progress, fileName) => {
                individualProgressCallback(progress, fileName);
              },
            );
            fileUrls.push(response);
            processedFiles++;
            totalProgressCallback(
              Math.round((processedFiles / totalFiles) * 100),
            );
          })
          .catch((error) => {
            throw new Error(`Failed to process file: ${error.message}`);
          });

        filePromises.push(promise);
      }
    });
  });

  await Promise.all(filePromises);

  return fileUrls;
}

export async function updateSectionsWithFileUrls(
  localSections: Section[],
  totalProgressCallback: TotalProgressCallback,
  individualProgressCallback: IndividualFileProgressCallack,
): Promise<Section[]> {
  const updatedSections = localSections.map((section) => ({
    ...section,
    lessons: section.lessons.map((lesson) => ({
      ...lesson,
    })),
  }));

  const fileUrls = await getFilesUrlsSections(
    updatedSections,
    totalProgressCallback,
    individualProgressCallback,
  );

  const fileUrlMap: Map<string, string> = new Map();

  fileUrls.forEach((fileUrl) =>
    fileUrlMap.set(fileUrl.fileId, fileUrl.fileUrl),
  );

  updatedSections.forEach((section) => {
    section.lessons.forEach((lesson) => {
      if (lesson.video instanceof File) {
        const fileUrl = fileUrlMap.get(lesson.id);

        if (fileUrl) {
          lesson.video = fileUrl;
        }
      }
    });
  });

  return updatedSections;
}

export async function uploadImage(
  image: File,
  progressCallback: IndividualFileProgressCallack,
): Promise<string> {
  const metaData = {
    fileName: image.name,
    fileId: nanoid(10),
    fileType: image.type,
  };

  progressCallback(10, metaData.fileName);
  const response = await api.post<SignedUrlResponse>(
    "/courses/uploads/get-signed-url",
    metaData,
  );
  const { fileUrl, uploadUrl } = response.data;

  progressCallback(30, metaData.fileName);
  await axios.put(uploadUrl, image, {
    headers: {
      "Content-Type": image.type,
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );

        progressCallback(30 + percentCompleted * 0.7, metaData.fileName);
      }
    },
  });

  progressCallback(100, metaData.fileName);

  return fileUrl;
}
