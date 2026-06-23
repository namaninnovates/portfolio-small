import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const works = pgTable('Work', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('imageUrl').notNull(),
  mediaType: text('mediaType').notNull().default('image'),
  tags: text('tags').notNull(),
  projectUrl: text('projectUrl'),
  liveUrl: text('liveUrl'),
  tools: text('tools').notNull(),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }).notNull().$onUpdate(() => new Date()),
});

export const enquiries = pgTable('Enquiry', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  projectType: text('projectType').notNull(),
  budget: text('budget').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' }).notNull().defaultNow(),
});
