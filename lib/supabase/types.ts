import type { AchievementId, DailyTime, StudyLevel, Subject, TutorMessage } from "@/lib/game";
import type { IeltsSection } from "@/lib/ielts";

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
      essays: {
        Row: {
          id: string;
          user_id: string;
          task_type: "task1" | "task2";
          prompt: string;
          essay: string;
          feedback: Json;
          estimated_band: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_type: "task1" | "task2";
          prompt: string;
          essay: string;
          feedback?: Json;
          estimated_band?: number | null;
          created_at?: string;
        };
        Update: {
          prompt?: string;
          essay?: string;
          feedback?: Json;
          estimated_band?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "essays_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      speaking_sessions: {
        Row: {
          id: string;
          user_id: string;
          part: "1" | "2" | "3";
          turns: Json;
          feedback: Json;
          estimated_band: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          part: "1" | "2" | "3";
          turns?: Json;
          feedback?: Json;
          estimated_band?: number | null;
          created_at?: string;
        };
        Update: {
          turns?: Json;
          feedback?: Json;
          estimated_band?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "speaking_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      generated_quizzes: {
        Row: {
          id: string;
          user_id: string;
          section: IeltsSection;
          title: string;
          content: Json;
          score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          section: IeltsSection;
          title: string;
          content?: Json;
          score?: number | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          content?: Json;
          score?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "generated_quizzes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      study_files: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          folder: string;
          mime_type: string | null;
          size_bytes: number;
          storage_path: string | null;
          text_preview: string | null;
          ai_summary: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          folder?: string;
          mime_type?: string | null;
          size_bytes?: number;
          storage_path?: string | null;
          text_preview?: string | null;
          ai_summary?: Json | null;
          created_at?: string;
        };
        Update: {
          folder?: string;
          mime_type?: string | null;
          size_bytes?: number;
          storage_path?: string | null;
          text_preview?: string | null;
          ai_summary?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "study_files_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      progress_events: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          section: IeltsSection;
          label: string;
          score: number | null;
          xp: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: string;
          section: IeltsSection;
          label: string;
          score?: number | null;
          xp?: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          label?: string;
          score?: number | null;
          xp?: number;
          metadata?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "progress_events_user_id_fkey";
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
