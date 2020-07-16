export interface Select2Option {
    id: string;
    text: string;
    disabled?: boolean;
    children?: Array<Select2Option>;
    additional?: any;
}
