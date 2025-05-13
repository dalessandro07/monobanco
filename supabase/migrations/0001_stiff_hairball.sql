ALTER TABLE "jugadores_salas_table" DROP CONSTRAINT "jugadores_salas_table_sala_id_salas_table_id_fk";
--> statement-breakpoint
ALTER TABLE "jugadores_salas_table" ADD CONSTRAINT "jugadores_salas_table_sala_id_salas_table_id_fk" FOREIGN KEY ("sala_id") REFERENCES "public"."salas_table"("id") ON DELETE no action ON UPDATE no action;