import * as path from 'path';

export class AppSettings {
  public static MAIN_CLIENT_PATH = path.join(__dirname, '../../client/dist');
  public static MAIN_CLIENT_HTML = path.join(
    __dirname,
    '../../client/dist/index.html'
  );
}
