export interface InterviewCalendarEntry {
  id?: string;
  interviewId?: string | null;
  status?: string;
  interviewDate?: string | Date | null;
}

export function getUpcomingInterviews<T extends InterviewCalendarEntry>(
  interviews: T[],
  now = Date.now(),
): T[] {
  return interviews
    .filter((interview) => {
      if (interview.status !== 'SCHEDULED' || !interview.interviewDate) {
        return false;
      }

      const startsAt = new Date(interview.interviewDate).getTime();
      return Number.isFinite(startsAt) && startsAt >= now;
    })
    .sort(
      (a, b) =>
        new Date(a.interviewDate!).getTime() -
        new Date(b.interviewDate!).getTime(),
    )
    .slice(0, 5);
}
