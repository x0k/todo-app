import { relations } from 'drizzle-orm'
import {
  boolean,
  char,
  datetime,
  json,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core'

import { type Brand } from './lib/type'

type TaskId = Brand<'TaskID', string>
type TasksListId = Brand<'TasksListID', string>
type EventId = Brand<'EventID', string>
enum TaskStatus {
  NotDone = 'n',
  Archived = 'a',
  Done = 'd',
}
enum EventType {
  TaskCreated = 't_c',
  TasksCreated = 'ts_c',
  TasksListCreated = 'tl_c',
  TaskUpdated = 't_u',
  TasksListUpdated = 'tl_u',
  TaskCompleted = 't_ct',
  TasksArchived = 'ts_a',
}

export const tasks = mysqlTable('tasks', {
  id: varchar('id', { length: 21 }).primaryKey().$type<TaskId>(),
  tasksListId: varchar('tasksListId', { length: 21 })
    .notNull()
    .references(() => tasksLists.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }),
  status: char('status').$type<TaskStatus>(),
  createdAt: datetime('createdAt'),
})

export const tasksRelations = relations(tasks, ({ one }) => ({
  tasksList: one(tasksLists, {
    fields: [tasks.tasksListId],
    references: [tasksLists.id],
  }),
}))

export const tasksLists = mysqlTable('tasksLists', {
  id: varchar('id', { length: 21 }).primaryKey().$type<TasksListId>(),
  title: varchar('title', { length: 255 }),
  isArchived: boolean('isArchived'),
  createdAt: datetime('createdAt'),
})

export const tasksListsRelations = relations(tasksLists, ({ many }) => ({
  tasks: many(tasks),
}))

export const events = mysqlTable('events', {
  id: varchar('id', { length: 21 }).primaryKey().$type<EventId>(),
  type: varchar('type', { length: 8 }).$type<EventType>(),
  createdAt: datetime('createdAt'),
  data: json('data'),
})
