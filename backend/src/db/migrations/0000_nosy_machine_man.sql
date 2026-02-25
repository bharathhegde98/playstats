CREATE TYPE "public"."account_status" AS ENUM('active', 'shadow', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'organizer', 'admin');--> statement-breakpoint
CREATE TYPE "public"."sport_type" AS ENUM('cricket', 'football', 'volleyball');--> statement-breakpoint
CREATE TYPE "public"."tournament_status" AS ENUM('draft', 'open', 'ongoing', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."player_position" AS ENUM('batsman', 'bowler', 'all_rounder', 'wicket_keeper', 'goalkeeper', 'defender', 'midfielder', 'forward', 'setter', 'outside_hitter', 'middle_blocker', 'libero', 'opposite');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('scheduled', 'live', 'completed', 'cancelled', 'postponed');--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('creator', 'admin', 'scorer', 'moderator');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('tournament_invite', 'team_invite', 'match_reminder', 'match_started', 'match_completed', 'account_claimed', 'team_approved', 'team_rejected');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" text NOT NULL,
	"email" text,
	"password_hash" text,
	"full_name" text NOT NULL,
	"username" text,
	"avatar_url" text,
	"bio" text,
	"status" "account_status" DEFAULT 'shadow' NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_by" uuid,
	"claimed_at" timestamp with time zone,
	"auth_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_at" timestamp with time zone,
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "tournaments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"sport_type" "sport_type" NOT NULL,
	"banner_url" text,
	"logo_url" text,
	"status" "tournament_status" DEFAULT 'draft' NOT NULL,
	"created_by" uuid NOT NULL,
	"max_teams" integer DEFAULT 16 NOT NULL,
	"current_teams" integer DEFAULT 0 NOT NULL,
	"min_players_per_team" integer DEFAULT 11 NOT NULL,
	"max_players_per_team" integer DEFAULT 15 NOT NULL,
	"registration_open_at" timestamp with time zone,
	"registration_close_at" timestamp with time zone,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"venue" text,
	"city" text,
	"country" text,
	"rules" jsonb DEFAULT '{}'::jsonb,
	"invite_code" text,
	"invite_link" text,
	"allow_public_join" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tournaments_slug_unique" UNIQUE("slug"),
	CONSTRAINT "tournaments_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"name" text NOT NULL,
	"short_name" text,
	"logo_url" text,
	"color_primary" text,
	"color_secondary" text,
	"manager_id" uuid NOT NULL,
	"captain_id" uuid,
	"status" text DEFAULT 'pending' NOT NULL,
	"stats" jsonb DEFAULT '{"wins":0,"losses":0,"draws":0,"points":0}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teams_tournament_id_name_unique" UNIQUE("tournament_id","name")
);
--> statement-breakpoint
CREATE TABLE "team_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"jersey_number" text NOT NULL,
	"position" "player_position",
	"is_captain" boolean DEFAULT false NOT NULL,
	"is_vice_captain" boolean DEFAULT false NOT NULL,
	"invitation_status" text DEFAULT 'accepted' NOT NULL,
	"invited_by" uuid NOT NULL,
	"invited_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone,
	"stats" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_players_team_id_user_id_unique" UNIQUE("team_id","user_id"),
	CONSTRAINT "team_players_team_id_jersey_number_unique" UNIQUE("team_id","jersey_number")
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"team_a_id" uuid NOT NULL,
	"team_b_id" uuid NOT NULL,
	"match_number" integer,
	"round" text,
	"status" "match_status" DEFAULT 'scheduled' NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"venue" text,
	"field_number" text,
	"toss_won_by" uuid,
	"toss_decision" text,
	"score" jsonb DEFAULT '{}'::jsonb,
	"live_data" jsonb,
	"winner_id" uuid,
	"result_type" text,
	"result_description" text,
	"referee_name" text,
	"umpire_names" text[],
	"man_of_the_match" uuid,
	"highlights_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "match_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"event_timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"match_time" text,
	"player_id" uuid,
	"team_id" uuid NOT NULL,
	"data" jsonb NOT NULL,
	"commentary" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tournament_teams" (
	"tournament_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"status" text DEFAULT 'confirmed' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tournament_teams_tournament_id_team_id_pk" PRIMARY KEY("tournament_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "tournament_admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournament_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "admin_role" NOT NULL,
	"permissions" jsonb DEFAULT '{}'::jsonb,
	"added_by" uuid NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tournament_admins_tournament_id_user_id_unique" UNIQUE("tournament_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"message" text,
	"related_tournament_id" uuid,
	"related_team_id" uuid,
	"related_match_id" uuid,
	"action_url" text,
	"action_label" text,
	"read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_captain_id_users_id_fk" FOREIGN KEY ("captain_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_players" ADD CONSTRAINT "team_players_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_players" ADD CONSTRAINT "team_players_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_players" ADD CONSTRAINT "team_players_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_team_a_id_teams_id_fk" FOREIGN KEY ("team_a_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_team_b_id_teams_id_fk" FOREIGN KEY ("team_b_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_toss_won_by_teams_id_fk" FOREIGN KEY ("toss_won_by") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_winner_id_teams_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_man_of_the_match_users_id_fk" FOREIGN KEY ("man_of_the_match") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_player_id_users_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_teams" ADD CONSTRAINT "tournament_teams_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_teams" ADD CONSTRAINT "tournament_teams_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_admins" ADD CONSTRAINT "tournament_admins_tournament_id_tournaments_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_admins" ADD CONSTRAINT "tournament_admins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournament_admins" ADD CONSTRAINT "tournament_admins_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_tournament_id_tournaments_id_fk" FOREIGN KEY ("related_tournament_id") REFERENCES "public"."tournaments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_team_id_teams_id_fk" FOREIGN KEY ("related_team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_related_match_id_matches_id_fk" FOREIGN KEY ("related_match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;