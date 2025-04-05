import { Option } from "@/models/option/domain/option";

export interface Component {
    id?: number;
    name: string;
    description: string;
    required: boolean;
    options: Option[];
    _destroy?: boolean;
}