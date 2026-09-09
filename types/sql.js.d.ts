declare module 'sql.js' {
  type SqlJsModule = {
    Database: new (...args: any[]) => any;
  };

  export default function initSqlJs(options?: any): Promise<SqlJsModule>;
}
