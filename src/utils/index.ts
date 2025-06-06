export const convertBytesToMB = (bytes: number, decimalPlaces = 2) => {
  if (bytes === 0) return "0 MB";

  // 1 MB = 1024 KB = 1024 * 1024 bytes
  const bytesInMB = 1024 * 1024;

  // Chuyển đổi và làm tròn đến số chữ số thập phân mong muốn
  const mb = (bytes / bytesInMB).toFixed(decimalPlaces);

  // Trả về chuỗi có định dạng
  return `${mb} MB`;
};

export type ApiResponse<T> = {
  message: string;
  data: T;
};
