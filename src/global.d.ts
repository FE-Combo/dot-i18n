declare namespace JSX {
    interface IntrinsicElements {
        i18n: React.DetailedHTMLProps<any, any>;
    }
}

declare const i18n: (value: string, language: string, namespace?: string) => any;
