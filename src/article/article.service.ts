import { ArticleEntity } from '@/article/article.entity';
import { CreateArticleDTO } from '@/article/dto/createArticle.dto';
import { IArticleResponse } from '@/article/types/articleResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { DeleteResult } from 'typeorm/browser';
import { UpdateArticleDTO } from '@/article/dto/updateArticle.dto';
import { IArticlesResponse } from '@/article/types/articlesResponse.interface';
@Injectable()
export class ArticleService {
    constructor(@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>) { }
    async createArticle(user: UserEntity, createArticleDto: CreateArticleDTO) : Promise<ArticleEntity> {
        const article = new ArticleEntity();
        Object.assign(article, createArticleDto);
        if (!article.tagList) {
            article.tagList = [];
        }
        article.slug = this.generateSlug(article.title);
        article.author = user;
        return this.articleRepository.save(article);
    }
    async getSingleArticle(slug: string) : Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);
        return article;
    }
    async findBySlug(slug: string) : Promise<ArticleEntity> {
         const article = await this.articleRepository.findOne({ where: { slug }});
        if (!article) {
            throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
        }
        return article;
    }
    async deleteArticle(slug:string,currentUserId:number):Promise<DeleteResult> {
        const article = await this.findBySlug(slug);
        console.log(currentUserId);
        if (article.author.id !== currentUserId) {
            throw new HttpException('You are not the author of this article', HttpStatus.FORBIDDEN);
        }
        return await this.articleRepository.delete({slug});
    }
    async updateArticle(slug: string, updateArticleDto: UpdateArticleDTO, currentUserId: number) {
        const article = await this.findBySlug(slug);
         if (article.author.id !== currentUserId) {
            throw new HttpException('You are not the author of this article', HttpStatus.FORBIDDEN);
        }
        if(updateArticleDto.title) {
            article.slug = this.generateSlug(updateArticleDto.title);
        }
        Object.assign(article, updateArticleDto);
        return await this.articleRepository.save(article);
    }

    async findAll(query : any) : Promise<IArticlesResponse> {
        const queryBuilder = this.articleRepository.createQueryBuilder('article').leftJoinAndSelect('article.author', 'author');
    if(query.tag){
        queryBuilder.andWhere('article.tagList LIKE :tag', { tag: `%${query.tag}%` });
    }
    if(query.author){
        queryBuilder.andWhere('author.username = :username', { username: query.author });
    }
    // queryBuilder.andWhere('article.authorId = :id' , {
    //     id : author?.id
    // })
    if(query.limit){
        queryBuilder.limit(query.limit);
    }
    if(query.offset){
        queryBuilder.offset(query.offset);
    }
    queryBuilder.orderBy('article.createdAt', 'DESC');
        const articles =  await queryBuilder.getMany();
    const articlesCount = await queryBuilder.getCount();
        return {articles , articlesCount}
    }
    generateSlug(title: string): string {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        return `${slugify(title, { lower: true })}-${id}`;
    }
    generateArticleResponse(article: ArticleEntity) : IArticleResponse {
        return {
            article
        }
    }
}
