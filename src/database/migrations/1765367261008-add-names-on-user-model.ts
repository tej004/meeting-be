import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNamesOnUserModel1765367261008 implements MigrationInterface {
    name = 'AddNamesOnUserModel1765367261008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "firstName" character varying(150) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "lastName" character varying(150) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "username" character varying(150) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "username"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "lastName"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "firstName"
        `);
    }

}
