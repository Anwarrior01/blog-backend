import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1777964722896 implements MigrationInterface {
    name = ' $npmConfigName1777964722896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "description" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "description" DROP DEFAULT`);
    }

}
