import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRoomRelation1765368202280 implements MigrationInterface {
    name = 'AddUserRoomRelation1765368202280'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "room"
            ADD "ownerUuid" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "room"
            ADD CONSTRAINT "FK_ae4aa4cd708794a85d6ed8463ec" FOREIGN KEY ("ownerUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "room" DROP CONSTRAINT "FK_ae4aa4cd708794a85d6ed8463ec"
        `);
        await queryRunner.query(`
            ALTER TABLE "room" DROP COLUMN "ownerUuid"
        `);
    }

}
