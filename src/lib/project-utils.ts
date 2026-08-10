import { ProjectStatus } from "@/types/equipment";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  survey: "Khảo sát",
  drafting: "Đang lập bản vẽ",
  pending_approval: "Chờ duyệt",
  approved: "Đã duyệt",
  completed: "Hoàn thành",
};

export const PROJECT_STATUS_CLASSES: Record<ProjectStatus, string> = {
  survey: "bg-primary/15 text-primary border-primary/30",
  drafting: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  pending_approval: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  completed: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export function getProjectStatusLabel(status?: string): string {
  const normalized = (status || "survey") as ProjectStatus;
  return PROJECT_STATUS_LABELS[normalized] || PROJECT_STATUS_LABELS.survey;
}

export function getProjectStatusClass(status?: string): string {
  const normalized = (status || "survey") as ProjectStatus;
  return PROJECT_STATUS_CLASSES[normalized] || PROJECT_STATUS_CLASSES.survey;
}
