ALTER TABLE "transacciones_table" DROP CONSTRAINT "transacciones_table_sala_id_salas_table_id_fk";
--> statement-breakpoint
ALTER TABLE "transacciones_table" ALTER COLUMN "sala_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transacciones_table" ADD CONSTRAINT "transacciones_table_sala_id_salas_table_id_fk" FOREIGN KEY ("sala_id") REFERENCES "public"."salas_table"("id") ON DELETE cascade ON UPDATE no action;