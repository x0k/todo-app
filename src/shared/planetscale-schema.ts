import {
  type ExtractTablesWithRelations,
  type InferModel,
  relations,
} from 'drizzle-orm'
import {
  boolean,
  char,
  json,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core'
import {
  type PlanetScaleDatabase,
  type PlanetScaleTransaction,
} from 'drizzle-orm/planetscale-serverless'

import { type Brand } from './lib/type'

type TaskId = Brand<'TaskID', string>
type TasksListId = Brand<'TasksListID', string>
type EventId = Brand<'EventID', string>
type WorkspaceId = Brand<'WorkspaceId', string>
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

const ID_LENGTH = 36
const TITLE_LENGTH = 255

export const tasks = mysqlTable('tasks', {
  id: varchar('id', { length: ID_LENGTH }).primaryKey().$type<TaskId>(),
  tasksListId: varchar('tasksListId', { length: ID_LENGTH })
    .notNull()
    .references(() => tasksLists.id, { onDelete: 'cascade' })
    .$type<TasksListId>(),
  title: varchar('title', { length: TITLE_LENGTH }).notNull(),
  status: char('status')
    .default(TaskStatus.NotDone)
    .notNull()
    .$type<TaskStatus>(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export type PSTask = InferModel<typeof tasks>

export const tasksRelations = relations(tasks, ({ one }) => ({
  tasksList: one(tasksLists, {
    fields: [tasks.tasksListId],
    references: [tasksLists.id],
  }),
}))

export const tasksLists = mysqlTable('tasksLists', {
  id: varchar('id', { length: ID_LENGTH }).primaryKey().$type<TasksListId>(),
  workspaceId: varchar('workspaceId', { length: ID_LENGTH })
    .notNull()
    .$type<WorkspaceId>(),
  title: varchar('title', { length: TITLE_LENGTH }).notNull(),
  isArchived: boolean('isArchived').default(false).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
})

export type PSTasksList = InferModel<typeof tasksLists>

export const tasksListsRelations = relations(tasksLists, ({ many }) => ({
  tasks: many(tasks),
}))

export const events = mysqlTable('events', {
  id: varchar('id', { length: ID_LENGTH }).primaryKey().$type<EventId>(),
  workspaceId: varchar('workspaceId', { length: ID_LENGTH })
    .notNull()
    .$type<WorkspaceId>(),
  type: varchar('type', { length: 8 }).notNull().$type<EventType>(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  data: json('data').notNull().$type<Record<string, unknown>>(),
})

export type PSEvent = InferModel<typeof events>

export const schema = {
  tasks,
  tasksRelations,
  tasksLists,
  tasksListsRelations,
  events,
}

export type SCHEMA = typeof schema
export type PSDB = PlanetScaleDatabase<SCHEMA>
export type PSTransaction = PlanetScaleTransaction<
  typeof schema,
  ExtractTablesWithRelations<SCHEMA>
>
