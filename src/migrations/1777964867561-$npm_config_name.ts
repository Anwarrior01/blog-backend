import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1777964867561 implements MigrationInterface {
    name = ' $npmConfigName1777964867561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "body" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "body"`);
    }

}
