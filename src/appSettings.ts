import * as path from 'path';

export class AppSettings {
  public static MAIN_CLIENT_PATH = path.join(__dirname, '../../client/dist');
  public static MAIN_CLIENT_HTML = path.join(
    __dirname,
    '../../client/dist/index.html'
  );

  public static HTTP_STATUS_OK = 200;
  public static HTTP_STATUS_UNAUTHORIZED = 401;
  public static HTTP_STATUS_NOT_FOUND = 404;
}
