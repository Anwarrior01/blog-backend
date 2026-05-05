import { ArticleEntity } from '@/article/article.entity';
import { ArticleService } from '@/article/article.service';
import { CreateArticleDTO } from '@/article/dto/createArticle.dto';
import { IArticleResponse } from '@/article/types/articleResponse.interface';
import { User } from '@/user/decorators/user.decorator';
import { AuthGuard } from '@/user/guards/auth.guard';
import { UserEntity } from '@/user/user.entity';
import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }
    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async createArticle(@User() user:UserEntity,@Body('article') createArticleDto : CreateArticleDTO):Promise<IArticleResponse>{ {
        const newArticle = await this.articleService.createArticle(user, createArticleDto);
        return this.articleService.generateArticleResponse(newArticle);
    }
}
}