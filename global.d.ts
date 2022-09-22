declare const _$$t: object | null

declare namespace JSX {
    interface IntrinsicElements {
        i18n: React.DetailedHTMLProps<any, any>;
    }
}

type I18NOptions =
    | {
          namespace?: string;
          language?: string;
          replace?: object;
      }
    | string;

declare const i18n: (value: string, options?: I18NOptions) => any;

