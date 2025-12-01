import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  username: string;
  password?: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  full_name?: string;
  phone?: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Student {
  id: number;
  user_id?: number;
  student_id: string;
  full_name: string;
  nick_name?: string;
  birth_date: Date;
  birth_place: string;
  gender: 'male' | 'female';
  parent_name: string;
  parent_phone: string;
  parent_email?: string;
  address: string;
  photo?: string;
  registration_date: Date;
  status: 'active' | 'inactive' | 'graduated';
  current_level?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Teacher {
  id: number;
  user_id?: number;
  full_name: string;
  photo?: string;
  specialization?: string;
  experience?: number;
  certification?: string;
  teaching_schedule?: any;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Curriculum {
  id: number;
  level: string;
  description?: string;
  materials?: any;
  learning_objectives?: string;
  duration_weeks?: number;
  prerequisites?: string;
  created_at: Date;
  updated_at: Date;
}

export interface StudentProgress {
  id: number;
  student_id: number;
  curriculum_id: number;
  current_page: number;
  total_pages?: number;
  completion_percentage: number;
  last_assessment_score?: number;
  assessment_notes?: string;
  completed_at?: Date;
  teacher_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Schedule {
  id: number;
  title: string;
  description?: string;
  event_type?: string;
  start_date: Date;
  end_date?: Date;
  start_time?: string;
  end_time?: string;
  location?: string;
  teacher_id?: number;
  class_level?: string;
  is_recurring: boolean;
  recurring_pattern?: string;
  created_at: Date;
  updated_at: Date;
}

export interface News {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  category?: string;
  author_id?: number;
  status: 'draft' | 'published';
  published_at?: Date;
  views: number;
  created_at: Date;
  updated_at: Date;
}

export interface Gallery {
  id: number;
  title: string;
  description?: string;
  file_path: string;
  file_type: 'image' | 'video';
  category?: string;
  event_date?: Date;
  uploaded_by?: number;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Testimonial {
  id: number;
  name: string;
  relationship?: string;
  content: string;
  photo?: string;
  rating: number;
  is_featured: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  replied_at?: Date;
  created_at: Date;
}

export interface StudentRegistration {
  id: number;
  registration_number: string;
  full_name: string;
  birth_date: Date;
  birth_place: string;
  gender: 'male' | 'female';
  parent_name: string;
  parent_phone: string;
  parent_email?: string;
  address: string;
  previous_education?: string;
  documents?: any;
  status: 'pending' | 'approved' | 'rejected' | 'interviewed';
  interview_date?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: number;
  student_id?: number;
  registration_id?: number;
  payment_type: string;
  amount: number;
  payment_method?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transaction_id?: string;
  payment_date?: Date;
  due_date?: Date;
  description?: string;
  receipt_path?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Settings {
  id: number;
  setting_key: string;
  setting_value?: string;
  setting_type: string;
  description?: string;
  updated_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface TpqSettings {
  site_name: string;
  site_description?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  whatsapp_message?: string;
}

export interface TpqSettings {
  site_name: string;
  site_description?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  whatsapp_message?: string;
}

// Utility functions
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateStudentId = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TPQ${year}${randomNum}`;
};

export const generateRegistrationNumber = (): string => {
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `REG${year}${month}${randomNum}`;
};