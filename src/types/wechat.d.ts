declare global {
  interface Window {
    wx: {
      scanQRCode: (options: {
        needResult: number;
        scanType: string[];
        success: (res: any) => void;
        fail: (e: any) => void;
      }) => void;
    };
  }
}

declare const wx: Window["wx"];
