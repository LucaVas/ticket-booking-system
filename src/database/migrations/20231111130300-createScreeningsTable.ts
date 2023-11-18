import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('screenings')
    .ifNotExists()
    .addColumn('id', 'integer', c => c.primaryKey().autoIncrement().notNull())
    .addColumn('date', 'text', c => c.notNull())
    .addColumn('time', 'text', c => c.notNull())
    .addColumn('movie_id', 'integer', c =>
      c.references('movies.id').onDelete('cascade').notNull()
    )
    .addColumn('total_tickets', 'integer')
    .addColumn('created_at', 'text')
    .addColumn('updated_at', 'text')
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('screenings');
}
