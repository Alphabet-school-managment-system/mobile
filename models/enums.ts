// Enums
export enum AttendanceStatusEnum {
  Present = "Present",
  Absent = "Absent",
  Excused = "Excused",
}
export type AttendanceStatus = "Present" | "Absent" | "Excused";

export type BehaviorType = "Positive" | "Negative";

export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type FeeStatus = "Paid" | "Unpaid";

export type FeeType = "Tuition" | "Exam" | "Other";

export type ExpenseType = "Salary" | "Rent" | "Other";

export type Sex = "Male" | "Female";

export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export type ParentType =
  | "Mother"
  | "Father"
  | "Brother"
  | "Sister"
  | "Aunt"
  | "Uncle"
  | "Guardian"
  | "Other";

export type StaffRole = "Librarian" | "Accountant" | "Admin";

export type LibraryItemType =
  | "BOOK"
  | "MAGAZINE"
  | "JOURNAL"
  | "E_BOOK"
  | "AUDIO_BOOK"
  | "REFERENCE_BOOK"
  | "OTHER";

export type BorrowStatus =
  | "RETURNED"
  | "BORROWED"
  | "RESERVED"
  | "OVERDUE"
  | "LOST"
  | "DAMAGED";

export enum LearningMaterialStatusEnum {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export type LearningMaterialStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export enum LearningMaterialSourceEnum {
  LINK = "link",
  FILE = "file",
}

export type LearningMaterialSource = "link" | "file";

export enum LearningMaterialFileTypeEnum {
  DOCUMENT = "document",
  VIDEO = "video",
}

export type LearningMaterialFileType = "document" | "video";
