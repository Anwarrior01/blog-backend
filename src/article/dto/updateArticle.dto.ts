import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateArticleDTO {
    @IsOptional()
    @IsString()
    @IsNotEmpty({message : 'title shouldnt be empty'})
    title: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsString()
    body: string
}