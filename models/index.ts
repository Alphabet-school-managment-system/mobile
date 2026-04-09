import {
  AttendanceStatus,
  BehaviorType,
  BorrowStatus,
  Day,
  ExpenseType,
  FeeStatus,
  FeeType,
  LearningMaterialSource,
  LearningMaterialFileType,
  LearningMaterialStatus,
  LeaveStatus,
  LibraryItemType,
  Sex,
  StaffRole,
} from "./enums.js";

export interface AcademicYear {
  id: string;
  branch_id: string;
  name: string;
  name_local: string;
  start_date: Date;
  end_date: Date;
  enrollment_start: Date;
  enrollment_end: Date;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface Assessment {
  id: string;
  academic_year_id: string;
  title: string;
  term: string;
  subject: string;
  grade: string;
  section?: string;
  max_score: number;
  note?: string | null;
  teacher_id?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface Attendance {
  id: string;
  academic_year_id: string;
  term: string;
  class: string;
  section: string;
  student_id: string;
  date: Date;
  created_at?: Date | null;
  updated_at?: Date | null;
  status: AttendanceStatus;
}

export interface Behavior {
  id: string;
  academic_year_id: string;
  term: string;
  student_id: string;
  date: Date;
  description?: string | null;
  type: BehaviorType;
  branchId?: string | null;
}

export interface Branch {
  id: string;
  school_id: string;
  name: string;
  location?: string | null;
  isCurrent?: boolean;
  isDefault?: boolean;
}

export interface Enrollment {
  id: string;
  academic_year_id: string;
  student_id: string;
  class: string;
  section?: string | null;
  isTransferred?: boolean | null;
  transferredFrom?: string | null;
  note?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface Expense {
  id: string;
  academic_year_id: string;
  title: string;
  description?: string | null;
  type: ExpenseType;
  amount: number;
  date: Date;
  receipt?: string | null;
  branchId?: string | null;
}

export interface Fee {
  id: string;
  academic_year_id: string;
  student_id: string;
  amount: number;
  due_date?: Date | null;
  status: FeeStatus;
  type: FeeType;
  receipt?: string | null;
  note?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface FinanceSummary {
  id: string;
  full_name?: string | null;
  full_name_local?: string | null;
  sex?: Sex | null;
  ay_name?: string | null;
  ay_name_local?: string | null;
  total_fee?: number | null;
  total_expense?: number | null;
  net_balance?: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface LeaveRequest {
  id: string;
  academic_year_id: string;
  student_id?: string | null;
  teacher_id?: string | null;
  staff_id?: string | null;
  start_date?: Date | null;
  end_date?: Date | null;
  note?: string | null;
  status: LeaveStatus;
}

export interface LibraryItem {
  id: string;
  branch_id: string;
  registration_number: string;
  title: string;
  author: string;
  item_type: LibraryItemType;
  subject: string;
  isbn?: string | null;
  copies_available?: number | null;
  publication_date: Date;
  note?: string | null;
}

export interface LibraryItemLoan {
  id: string;
  item_id: string;
  student_id?: string | null;
  teacher_id?: string | null;
  issue_date: Date;
  return_date: Date;
  status: BorrowStatus;
  note?: string | null;
  branchId?: string | null;
}

export interface LearningMaterial {
  id: string;
  title: string;
  description?: string | null;
  material_url: string;
  material_type: LearningMaterialFileType;
  material_size: number;
  uploaded_by: string;
  branch_id: string;
  grade?: string | null;
  subject: string;
  material_source: LearningMaterialSource;
  status: LearningMaterialStatus;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface Mark {
  id: string;
  student_id: string;
  assessment_id: string;
  score: number;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface School {
  id: string;
  name: string;
  address?: string | null;
  contact?: string | null;
  note?: string | null;
  better_auth_id: string;
}

export interface Parent {
  id: string;
  branch_id: string;
  better_auth_id: string;
  first_name: string;
  middle_name: string;
  phone: string;
  email: string;
  sex: Sex;
  address: string;
  note?: string | null;
  studentRelationsId?: string | null;
}

export interface Staff {
  id: string;
  branch_id?: string | null;
  better_auth_id: string;
  first_name: string;
  middle_name: string;
  phone?: string | null;
  email: string;
  sex?: Sex | null;
  role: StaffRole;
}

export interface Student {
  id: string;
  branch_id: string;
  better_auth_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name_local: string;
  sex: Sex;
  dob: Date;
  address: string;
  email: string;
  phone: string;
  note?: string | null;
  image: string;
  student_registration_number?: number;
}

export interface Teacher {
  id: string;
  better_auth_id: string;
  first_name: string;
  middle_name: string;
  phone: string;
  email: string;
  sex: Sex;
  subject_specialization: string;
  note?: string | null;
  image: string;
  branch_id: string;
  teacher_registration_number: number;
}

export interface StudentMarkSummary {
  id: string;
  full_name?: string | null;
  full_name_local?: string | null;
  sex?: Sex | null;
  ay_name?: string | null;
  ay_name_local?: string | null;
  subject?: string | null;
  total_score?: number | null;
  average_score?: number | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface Timetable {
  id: string;
  academic_year_id: string;
  term?: string;
  grade: string;
  section: string;
  teacher_id: string;
  day: Day;
  period: number;
  note?: string | null;
}

export interface ParentStudent {
  id: string;
  parent_id: string;
  student_id: string;
}

export interface Setting {
  id: string;
  branch_id: string;
  key: string;
  value: string;
}

export interface Dashboard {
  total_students?: number | null;
  total_teachers?: number | null;
  total_staff?: number | null;
  total_parents?: number | null;
  total_classes?: number | null;
  total_sections?: number | null;
  total_library_items?: number | null;
  total_library_items_loaned?: number | null;
}

export type levels_of_education =
  | "kg"
  | "primary"
  | "secondary"
  | "college_prep";

export type selectType = {
  label: string;
  value: string | number | boolean | any;
};

export { AttendanceStatus };
