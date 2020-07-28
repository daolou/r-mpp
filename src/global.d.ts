declare module '*';

interface IAnyObj {
  [propName: string]: any;
}

interface II18n {
  lang: string;
  [propName: string]: any;
}
