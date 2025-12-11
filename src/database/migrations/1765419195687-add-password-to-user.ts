import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUser1765419195687 implements MigrationInterface {
    name = 'AddPasswordToUser1765419195687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "password" character varying(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "password"
        `);
    }

}
