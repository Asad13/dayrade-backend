import type { Server } from 'http';

class Config {
  private _server: Server | undefined;

  get server(): Server | undefined {
    return this._server;
  }

  set server(s: Server | undefined) {
    this._server = s;
  }
}

const config = new Config();

export default config;
