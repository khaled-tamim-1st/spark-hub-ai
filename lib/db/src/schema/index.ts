import {
  pgTable, serial, text, varchar, boolean, timestamp, integer, numeric,
} from 'drizzle-orm/pg-core';

// ─── Organizations ────────────────────────────────────────────────────────────
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  logoUrl: text('logo_url'),
  website: text('website'),
  plan: varchar('plan', { length: 50 }).default('free').notNull(), // 'free' | 'starter' | 'pro' | 'enterprise'
  status: varchar('status', { length: 50 }).default('active').notNull(), // 'active' | 'suspended' | 'trial' | 'cancelled'
  maxUsers: integer('max_users').default(5).notNull(),
  maxChannels: integer('max_channels').default(2).notNull(),
  aiEnabled: boolean('ai_enabled').default(true).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: varchar('role', { length: 50 }).default('agent').notNull(),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Organization Memberships (Many-to-Many User <-> Organizations) ───────────
export const organizationMembers = pgTable('organization_members', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 50 }).default('agent').notNull(), // 'owner' | 'admin' | 'agent' | 'viewer'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Channels ────────────────────────────────────────────────────────────────
export const channels = pgTable('channels', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  channelType: varchar('channel_type', { length: 50 }).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  config: text('config'),   // JSON string of provider config
  webhookUrl: text('webhook_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Companies ───────────────────────────────────────────────────────────────
export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  website: text('website'),
  industry: varchar('industry', { length: 100 }),
  size: varchar('size', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Tags ────────────────────────────────────────────────────────────────────
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 20 }),
});

// ─── Contacts ────────────────────────────────────────────────────────────────
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  companyId: integer('company_id')
    .references(() => companies.id, { onDelete: 'set null' }),
  companyName: varchar('company_name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  lastActivityAt: timestamp('last_activity_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Contact Tags (junction) ──────────────────────────────────────────────────
export const contactTags = pgTable('contact_tags', {
  contactId: integer('contact_id')
    .references(() => contacts.id, { onDelete: 'cascade' }).notNull(),
  tagId: integer('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' }).notNull(),
});

// ─── Conversations ───────────────────────────────────────────────────────────
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  channelId: integer('channel_id')
    .references(() => channels.id, { onDelete: 'set null' }),
  contactId: integer('contact_id')
    .references(() => contacts.id, { onDelete: 'set null' }),
  assigneeId: integer('assignee_id')
    .references(() => users.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 20 }).default('open').notNull(),
  channelType: varchar('channel_type', { length: 50 }).notNull(),
  subject: varchar('subject', { length: 500 }),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
  lastMessage: text('last_message'),
  unreadCount: integer('unread_count').default(0).notNull(),
  aiHandled: boolean('ai_handled').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Messages ────────────────────────────────────────────────────────────────
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id')
    .references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
  senderType: varchar('sender_type', { length: 20 }).notNull(),   // contact|agent|ai|system
  senderId: integer('sender_id')
    .references(() => users.id, { onDelete: 'set null' }),
  senderName: varchar('sender_name', { length: 200 }),
  content: text('content').notNull(),
  mediaUrl: text('media_url'),  // URL for image/audio/video/sticker attachments
  messageType: varchar('message_type', { length: 20 }).default('text').notNull(),
  status: varchar('status', { length: 20 }).default('sent').notNull(),
  isPrivate: boolean('is_private').default(false).notNull(),
  externalId: varchar('external_id', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Pipelines ───────────────────────────────────────────────────────────────
export const pipelines = pgTable('pipelines', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Pipeline Stages ─────────────────────────────────────────────────────────
export const pipelineStages = pgTable('pipeline_stages', {
  id: serial('id').primaryKey(),
  pipelineId: integer('pipeline_id')
    .references(() => pipelines.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  order: integer('order').default(0).notNull(),
  color: varchar('color', { length: 20 }),
});

// ─── Deals ───────────────────────────────────────────────────────────────────
export const deals = pgTable('deals', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  pipelineId: integer('pipeline_id')
    .references(() => pipelines.id, { onDelete: 'set null' }),
  stageId: integer('stage_id')
    .references(() => pipelineStages.id, { onDelete: 'set null' }),
  contactId: integer('contact_id')
    .references(() => contacts.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  value: numeric('value', { precision: 15, scale: 2 }).default('0'),
  currency: varchar('currency', { length: 10 }).default('USD'),
  status: varchar('status', { length: 20 }).default('open').notNull(),
  assigneeId: integer('assignee_id')
    .references(() => users.id, { onDelete: 'set null' }),
  closedAt: timestamp('closed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Notes ───────────────────────────────────────────────────────────────────
export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id')
    .references(() => users.id, { onDelete: 'set null' }),
  contactId: integer('contact_id')
    .references(() => contacts.id, { onDelete: 'cascade' }),
  conversationId: integer('conversation_id')
    .references(() => conversations.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Knowledge Docs ──────────────────────────────────────────────────────────
export const knowledgeDocs = pgTable('knowledge_docs', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content').notNull(),
  contentType: varchar('content_type', { length: 50 }).default('text').notNull(),
  status: varchar('status', { length: 20 }).default('ready').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── AI Settings ─────────────────────────────────────────────────────────────
export const aiSettings = pgTable('ai_settings', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull().unique(),
  provider: varchar('provider', { length: 50 }).default('ollama').notNull(),
  model: varchar('model', { length: 100 }).default('llama3').notNull(),
  baseUrl: text('base_url').default('http://localhost:11434'),
  apiKey: text('api_key'),
  systemPrompt: text('system_prompt'),
  temperature: numeric('temperature', { precision: 3, scale: 2 }).default('0.7'),
  maxTokens: integer('max_tokens').default(1000),
  autoReply: boolean('auto_reply').default(false).notNull(),
  autoReplyConfidence: numeric('auto_reply_confidence', { precision: 3, scale: 2 }).default('0.8'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Voice Sessions ──────────────────────────────────────────────────────────
export const voiceSessions = pgTable('voice_sessions', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  conversationId: integer('conversation_id')
    .references(() => conversations.id, { onDelete: 'set null' }),
  contactId: integer('contact_id')
    .references(() => contacts.id, { onDelete: 'set null' }),
  channelId: integer('channel_id')
    .references(() => channels.id, { onDelete: 'set null' }),
  agentId: integer('agent_id')
    .references(() => users.id, { onDelete: 'set null' }),
  sessionId: varchar('session_id', { length: 100 }).notNull().unique(),
  providerCallId: varchar('provider_call_id', { length: 255 }),
  status: varchar('status', { length: 30 }).default('initiated').notNull(), // initiated | ringing | in_progress | completed | busy | failed | no_answer
  direction: varchar('direction', { length: 10 }).default('inbound').notNull(), // inbound | outbound
  callerNumber: varchar('caller_number', { length: 50 }),
  calleeNumber: varchar('callee_number', { length: 50 }),
  provider: varchar('provider', { length: 50 }).default('mock').notNull(), // mock | generic_sip | twilio | etc.
  durationSeconds: integer('duration_seconds').default(0),
  transcript: text('transcript'),
  transcriptJson: text('transcript_json'), // Structured array: [{role, text, timestamp}]
  summary: text('summary'),
  metadata: text('metadata'), // JSON string for provider metadata, SIP headers, QoS
  errorReason: text('error_reason'),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  answeredAt: timestamp('answered_at', { withTimezone: true }),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Type exports ─────────────────────────────────────────────────────────────
export type Organization = typeof organizations.$inferSelect;
export type User = typeof users.$inferSelect;
export type Channel = typeof channels.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Pipeline = typeof pipelines.$inferSelect;
export type PipelineStage = typeof pipelineStages.$inferSelect;
export type Deal = typeof deals.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type KnowledgeDoc = typeof knowledgeDocs.$inferSelect;
export type AiSettings = typeof aiSettings.$inferSelect;
export type VoiceSession = typeof voiceSessions.$inferSelect;

