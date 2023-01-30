import * as path from 'path';

let dir = __dirname;
if (dir.includes('dist')) {
  dir = path.join(__dirname, '../');
}

export class AppSettings  {
  public static MAIN_CLIENT_PATH = path.join(dir, '../client/dist');
  public static MAIN_CLIENT_HTML = path.join(dir, '../client/dist/index.html');
}