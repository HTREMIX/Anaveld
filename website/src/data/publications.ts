export interface DemoPublication {
  id: string;
  number: string;
  title: string;
  titleVi: string;
  kind: string;
  subject: string;
  summary: string;
  scope: string;
  tone: 'olive' | 'navy' | 'clay';
  motif: 'orbit' | 'field' | 'wave';
  status: 'DEMO_UNVERIFIED';
}

// Invented interface fixtures. These IDs do not issue, identify or verify ANVs.
export const publications: DemoPublication[] = [
  {
    id: 'demo-01', number: '01', title: 'The quiet geometry of motion',
    titleVi: 'Hình học của những dao động nhỏ', kind: 'Model study', subject: 'Mechanics',
    summary: 'A question, a set of assumptions, and a closer look at the patterns within motion.',
    scope: 'An illustrative introduction to small oscillations around a stable equilibrium. The sample keeps its assumptions visible: one coordinate, a linear restoring force, and no damping.',
    tone: 'olive', motif: 'orbit', status: 'DEMO_UNVERIFIED',
  },
  {
    id: 'demo-02', number: '02', title: 'Fields, framed by questions',
    titleVi: 'Đặt câu hỏi về trường vật lý', kind: 'Problem exploration', subject: 'Fields',
    summary: 'An invitation to look at what a model includes, and what it deliberately leaves outside.',
    scope: 'A fictional catalogue entry for testing discovery and editorial presentation. No real field problem, source publication, author or release is represented.',
    tone: 'navy', motif: 'field', status: 'DEMO_UNVERIFIED',
  },
  {
    id: 'demo-03', number: '03', title: 'A language for change',
    titleVi: 'Một ngôn ngữ để hiểu sự biến đổi', kind: 'Mathematical notes', subject: 'Mathematics',
    summary: 'Looking for a useful description before reaching for a familiar answer.',
    scope: 'A fictional mathematical-notes entry. It exercises an independent publication format; it is not an issued ANV or a prerequisite for another entry.',
    tone: 'clay', motif: 'wave', status: 'DEMO_UNVERIFIED',
  },
];

export const demoPdfUrl = '/assets/anaveld-reader-demo.pdf';
export const normalizeText = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
