import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCorrectJoinColumnOnRoomModel1765368486312 implements MigrationInterface {
    name = 'AddCorrectJoinColumnOnRoomModel1765368486312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "room" DROP CONSTRAINT "FK_ae4aa4cd708794a85d6ed8463ec"
        `);
        await queryRunner.query(`
            ALTER TABLE "room"
                RENAME COLUMN "ownerUuid" TO "ownerId"
        `);
        await queryRunner.query(`
            ALTER TABLE "room"
            ADD CONSTRAINT "FK_65283be59094a73fed31ffeee4e" FOREIGN KEY ("ownerId") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "room" DROP CONSTRAINT "FK_65283be59094a73fed31ffeee4e"
        `);
        await queryRunner.query(`
            ALTER TABLE "room"
                RENAME COLUMN "ownerId" TO "ownerUuid"
        `);
        await queryRunner.query(`
            ALTER TABLE "room"
            ADD CONSTRAINT "FK_ae4aa4cd708794a85d6ed8463ec" FOREIGN KEY ("ownerUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
