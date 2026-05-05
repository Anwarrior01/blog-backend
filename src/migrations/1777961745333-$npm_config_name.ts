import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1777961745333 implements MigrationInterface {
    name = ' $npmConfigName1777961745333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "favoritesCount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "favoritesCount"`);
    }

}
