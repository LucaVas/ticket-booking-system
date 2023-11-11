import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('bookings')
    .ifNotExists()
    .addColumn('screening_id', 'integer', c =>
      c.references('screenings.id').onDelete('cascade').notNull()
    )
    .addColumn('user_id', 'integer', c =>
      c.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('seat', 'text', c => c.notNull())
    .addColumn('booked_at', 'text', c => c.notNull())
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('bookings');
}
