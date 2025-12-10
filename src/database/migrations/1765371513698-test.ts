import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1765371513698 implements MigrationInterface {
    name = 'Test1765371513698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "firstName"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "firstName" character varying(151) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "firstName"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "firstName" character varying(150) NOT NULL
        `);
    }

}
