declare global {
  interface Window {
    wx: {
      scanQRCode: (options: {
        needResult: number;
        scanType: string[];
        success: (res: any) => void;
        fail: (e: any) => void;
      }) => void;
      ready: (callback: () => void) => void;
      config: (config: any) => void;
      getNetworkType: (options: { success: (res: any) => void }) => void;
    };
    app: any;
    wechatSDKInitialized: boolean;
    mplogin: (options: any) => Promise<any>;
  }
}

declare const wx: Window["wx"];
