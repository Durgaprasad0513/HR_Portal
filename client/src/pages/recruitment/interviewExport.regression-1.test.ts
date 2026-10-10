import { describe, expect, it } from 'vitest';
import { interviewCsv, candidateCsv } from './interviewExport';

describe('interview register export', () => {
  it('preserves commas, quotes, line breaks and status separately from feedback', () => {
    const csv = interviewCsv([{ candidateName: 'QA, "Candidate"', interviewLocation: 'Room\nTwo',
      selectionStatus: 'SELECTED', interviewFeedback: 'Panel approved' }]);
    expect(csv).toContain('"QA, ""Candidate"""');
    expect(csv).toContain('"Room\nTwo"');
    expect(csv).toContain('"SELECTED","Panel approved"');
  });
  it('prevents spreadsheet formulas in user-entered cells', () => {
    expect(interviewCsv([{ candidateName: '=1+1', interviewFeedback: ' @SUM(1)' }])).toContain('"\'=1+1"');
    expect(interviewCsv([{ candidateName: '=1+1', interviewFeedback: ' @SUM(1)' }])).toContain('"\' @SUM(1)"');
  });
  it('escapes the recruitment candidate register and exports empty values without undefined', () => {
    const csv = candidateCsv([{ candidateName: 'QA "Name"', currentCompany: '=SUM(1)', email: 'qa@recruitment.test' }]);
    expect(csv).toContain('"QA ""Name"""');
    expect(csv).toContain('"\'=SUM(1)"');
    expect(csv).not.toContain('undefined');
  });
});
