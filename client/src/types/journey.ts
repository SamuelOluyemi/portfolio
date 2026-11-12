export interface JourneyMilestone {
  id: number;
  organization: string;
  title: string;
  description: string;
  dateLabel?: string | null;
  displayOrder: number;
}
