import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAndRoomModels1765351666732 implements MigrationInterface {
    name = 'UserAndRoomModels1765351666732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'user',
                "email" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "room" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(150) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4cc328315dd693133cad17e3d7c" PRIMARY KEY ("uuid")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "room"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
    }

}
