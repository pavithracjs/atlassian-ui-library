declare module 'projector-spawn' {
  export = index;
  declare function index(cmd: any, args: any, opts?: any): any;
  declare namespace index {
    class ChildProcessError {
      static captureStackTrace(p0: any, p1: any): any;
      static stackTraceLimit: number;
      constructor(code: any, stdout: any, stderr: any);
      code: any;
      stdout: any;
      stderr: any;
    }
  }
}
