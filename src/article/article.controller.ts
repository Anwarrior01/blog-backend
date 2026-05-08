import { ArticleEntity } from '@/article/article.entity';
import { ArticleService } from '@/article/article.service';
import { CreateArticleDTO } from '@/article/dto/createArticle.dto';
import { UpdateArticleDTO } from '@/article/dto/updateArticle.dto';
import { IArticleResponse } from '@/article/types/articleResponse.interface';
import { IArticlesResponse } from '@/article/types/articlesResponse.interface';
import { User } from '@/user/decorators/user.decorator';
import { AuthGuard } from '@/user/guards/auth.guard';
import { UserEntity } from '@/user/user.entity';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }
    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async createArticle(@User() user: UserEntity, @Body('article') createArticleDto: CreateArticleDTO): Promise<IArticleResponse> {
        {
            const newArticle = await this.articleService.createArticle(user, createArticleDto);
            return this.articleService.generateArticleResponse(newArticle);
        }
    }
    @Get(':slug')
    async getArticle(@Param('slug') slug: string) : Promise<IArticleResponse> {
        const article = await this.articleService.getSingleArticle(slug);
        return this.articleService.generateArticleResponse(article);
    }
    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticle(@Param('slug') slug: string,@User('id') currentUserId: number) {
        return await this.articleService.deleteArticle(slug, currentUserId);
    }

    @Put(':slug')
    @UseGuards(AuthGuard)
    async updateArticle(@Param('slug') slug: string, @Body('article') updateArticleDto: UpdateArticleDTO, @User('id') currentUserId: number) : Promise<IArticleResponse> {
       
        const updatedArticle = await this.articleService.updateArticle(slug, updateArticleDto,currentUserId);
        return this.articleService.generateArticleResponse(updatedArticle);
    }

    @Get()
    async getArticles(@Query() query : any) : Promise<IArticlesResponse>{
        return await this.articleService.findAll(query);
    }

    @Post(':slug/favorite')
    @UseGuards(AuthGuard)
    async favoriteArticle(@Param('slug') slug: string, @User('id') currentUserId: number) : Promise<IArticleResponse> { {
        return this.articleService.addToFavoriteArticle(slug, currentUserId);
    }}
}