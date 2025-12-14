// Type declarations for mysql2/promise (peer dependency)
declare module 'mysql2/promise' {
  export interface ConnectionOptions {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
  }

  export interface Connection {
    // Connection interface
  }

  export function createConnection(options: ConnectionOptions): Promise<Connection>;
}

