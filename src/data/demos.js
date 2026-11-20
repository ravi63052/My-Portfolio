export const sampleAssets = [
  { id: 1, name: 'Solar Array A', type: 'Solar', status: 'Active' },
  { id: 2, name: 'Wind Turbine B', type: 'Wind', status: 'Maintenance' },
  { id: 3, name: 'Solar Array C', type: 'Solar', status: 'Active' },
];
export const sqlExamples = [
  { question: 'Show all assets', sql: 'SELECT id, name, type, status FROM assets;', rows: sampleAssets },
  { question: 'Which assets need maintenance?', sql: "SELECT id, name, type, status FROM assets WHERE status = 'Maintenance';", rows: sampleAssets.filter(a => a.status === 'Maintenance') },
  { question: 'Show solar assets', sql: "SELECT id, name, type, status FROM assets WHERE type = 'Solar';", rows: sampleAssets.filter(a => a.type === 'Solar') },
];
export function runSampleQuery(question) {
  const match = sqlExamples.find(e => e.question.toLowerCase() === question.trim().toLowerCase());
  if (!match) throw new Error('Choose one of the sample questions. This local demonstration does not generate or execute arbitrary SQL.');
  return match;
}
export const ticketSamples = [
  { label: 'Electrical hazard', ticket: 'Smoke reported near the inverter cabinet.', severity: 'Critical', team: 'Electrical safety team', action: 'Escalate for immediate human review; follow site safety procedures.', reason: 'Safety override: the report contains an explicit hazard.', tag: 'SAFETY OVERRIDE' },
  { label: 'Turbine vibration', ticket: 'Unusual vibration reported on a wind turbine.', severity: 'High', team: 'Mechanical maintenance', action: 'Arrange inspection of the turbine and review recent maintenance records.', reason: 'Mechanical issue keywords suggest a maintenance inspection.', tag: 'KEYWORD CLASSIFICATION' },
  { label: 'Panel soiling', ticket: 'Dust buildup observed on a solar panel array.', severity: 'Routine', team: 'Solar operations', action: 'Schedule a panel inspection and cleaning assessment.', reason: 'Panel-soiling keywords route the ticket to solar operations.', tag: 'KEYWORD CLASSIFICATION' },
];
