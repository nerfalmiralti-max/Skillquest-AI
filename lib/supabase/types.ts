import type { AchievementId, DailyTime, StudyLevel, Subject, TutorMessage } from "@/lib/game";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          subject: Subject | null;
          level: StudyLevel | null;
          daily_time: DailyTime | null;
          xp: number;
          streak: number;
          last_quest_date: string | null;
          boss_attempts: number;
          boss_wins: number;
          tutor_messages: TutorMessage[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          subject?: Subject | null;
          level?: StudyLevel | null;
          daily_time?: DailyTime | null;
          xp?: number;
          streak?: number;
          last_quest_date?: string | null;
          boss_attempts?: number;
          boss_wins?: number;
          tutor_messages?: TutorMessage[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          subject?: Subject | null;
          level?: StudyLevel | null;
          daily_time?: DailyTime | null;
          xp?: number;
          streak?: number;
          last_quest_date?: string | null;
          boss_attempts?: number;
          boss_wins?: number;
          tutor_messages?: TutorMessage[];
          updated_at?: string;
        };
        Relationships: [];
      };
      quests: {
        Row: {
          id: string;
          user_id: string;
          quest_id: string;
          date_key: string;
          title: string | null;
          subject: Subject | null;
          xp_awarded: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quest_id: string;
          date_key: string;
          title?: string | null;
          subject?: Subject | null;
          xp_awarded?: number;
          completed_at?: string;
        };
        Update: {
          title?: string | null;
          subject?: Subject | null;
          xp_awarded?: number;
          completed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quests_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: AchievementId;
          unlocked_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: AchievementId;
          unlocked_at: string;
          created_at?: string;
        };
        Update: {
          unlocked_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      quiz_results: {
        Row: {
          id: string;
          user_id: string;
          subject: Subject | null;
          score: number;
          total_questions: number;
          xp_awarded: number;
          passed: boolean;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject?: Subject | null;
          score: number;
          total_questions: number;
          xp_awarded: number;
          passed: boolean;
          completed_at?: string;
        };
        Update: {
          subject?: Subject | null;
          score?: number;
          total_questions?: number;
          xp_awarded?: number;
          passed?: boolean;
          completed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_results_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
