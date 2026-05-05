import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateArticleDTO {
    @IsNotEmpty()
    readonly title: string;
    
    @IsNotEmpty()
    readonly description: string;

    @IsNotEmpty()
    readonly body: string;

    @IsArray()
    @IsString({ each: true })
    readonly tagList: string[];
}