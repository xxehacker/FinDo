import { API_ENDPOINTS, BASE_URL } from "@/utils/apiPath";
import AXIOS_INSTANCE from "@/utils/axiosInstance";

export async function uploadCaptureFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await AXIOS_INSTANCE.post(API_ENDPOINTS.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const path = response.data?.data?.url;
  if (!path) throw new Error("Upload failed");

  const base = BASE_URL.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path}`;
}
