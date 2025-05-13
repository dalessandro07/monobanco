CREATE TABLE "jugadores_salas_table" (
	"sala_id" uuid,
	"jugador_id" uuid,
	"balance" integer DEFAULT 1500 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "jugadores_salas_table_sala_id_jugador_id_pk" PRIMARY KEY("sala_id","jugador_id"),
	CONSTRAINT "balance_check1" CHECK ("jugadores_salas_table"."balance" >= 0)
);
--> statement-breakpoint
CREATE TABLE "jugadores_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "jugadores_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "salas_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"codigo_sala" text NOT NULL,
	"visualizacion" text DEFAULT 'PUBLICA' NOT NULL,
	"estado" text DEFAULT 'ABIERTA' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"closed_at" timestamp DEFAULT null,
	CONSTRAINT "salas_table_codigo_sala_unique" UNIQUE("codigo_sala")
);
--> statement-breakpoint
CREATE TABLE "transacciones_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sala_id" uuid,
	"jugador_origen_id" uuid NOT NULL,
	"jugador_destino_id" uuid,
	"monto" integer NOT NULL,
	"tipo" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jugadores_salas_table" ADD CONSTRAINT "jugadores_salas_table_sala_id_salas_table_id_fk" FOREIGN KEY ("sala_id") REFERENCES "public"."salas_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jugadores_salas_table" ADD CONSTRAINT "jugadores_salas_table_jugador_id_jugadores_table_id_fk" FOREIGN KEY ("jugador_id") REFERENCES "public"."jugadores_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salas_table" ADD CONSTRAINT "salas_table_created_by_jugadores_table_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."jugadores_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones_table" ADD CONSTRAINT "transacciones_table_sala_id_salas_table_id_fk" FOREIGN KEY ("sala_id") REFERENCES "public"."salas_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones_table" ADD CONSTRAINT "transacciones_table_jugador_origen_id_jugadores_table_id_fk" FOREIGN KEY ("jugador_origen_id") REFERENCES "public"."jugadores_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacciones_table" ADD CONSTRAINT "transacciones_table_jugador_destino_id_jugadores_table_id_fk" FOREIGN KEY ("jugador_destino_id") REFERENCES "public"."jugadores_table"("id") ON DELETE no action ON UPDATE no action;