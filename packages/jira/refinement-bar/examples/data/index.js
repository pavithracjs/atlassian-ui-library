// @noflow

export const CAPITALS = [
  { label: 'Adelaide', value: 'adelaide' },
  { label: 'Brisbane', value: 'brisbane' },
  { label: 'Canberra', value: 'canberra' },
  { label: 'Darwin', value: 'darwin' },
  { label: 'Hobart', value: 'hobart' },
  { label: 'Melbourne', value: 'melbourne' },
  { label: 'Perth', value: 'perth' },
  { label: 'Sydney', value: 'sydney' },
];

export const ISSUE_TYPES = [
  { value: 'bug', type: 'bug', label: 'Bug' },
  { value: 'changes', type: 'changes', label: 'Changes' },
  { value: 'epic', type: 'epic', label: 'Epic' },
  { value: 'improvement', type: 'improvement', label: 'Improvement' },
  { value: 'incident', type: 'incident', label: 'Incident' },
  { value: 'new-feature', type: 'new-feature', label: 'New feature' },
  { value: 'problem', type: 'problem', label: 'Problem' },
  { value: 'question', type: 'question', label: 'Question' },
  { value: 'story', type: 'story', label: 'Story' },
  { value: 'subtask', type: 'subtask', label: 'Subtask' },
  { value: 'task', type: 'task', label: 'Task' },
];

export const USERS = [
  {
    value: 'andrew-clark',
    label: 'Andrew Clark',
    avatar: `http://i.pravatar.cc/48?u=andrew-clark`,
  },
  {
    value: 'brian-vaughn',
    label: 'Brian Vaughn',
    avatar: `http://i.pravatar.cc/48?u=brian-vaughn`,
  },
  {
    value: 'cheng-lou',
    label: 'Cheng Lou',
    avatar: `http://i.pravatar.cc/48?u=cheng-lou`,
  },
  {
    value: 'christopher-chedeau',
    label: 'Christopher Chedeau',
    avatar: `http://i.pravatar.cc/48?u=christopher-chedeau`,
  },
  {
    value: 'dan-abromov',
    label: 'Dan Abromov',
    avatar: `http://i.pravatar.cc/48?u=dan-abromov`,
  },
  {
    value: 'james-long',
    label: 'James Long',
    avatar: `http://i.pravatar.cc/48?u=james-long`,
  },
  {
    value: 'jason-miller',
    label: 'Jason Miller',
    avatar: `http://i.pravatar.cc/48?u=jason-miller`,
  },
  {
    value: 'ken-wheeler',
    label: 'Ken Wheeler',
    avatar: `http://i.pravatar.cc/48?u=ken-wheeler`,
  },
  {
    value: 'kent-c-dodds',
    label: 'Kent C. Dodds',
    avatar: `http://i.pravatar.cc/48?u=kent-c-dodds`,
  },
  {
    value: 'kyle-mathews',
    label: 'Kyle Mathews',
    avatar: `http://i.pravatar.cc/48?u=kyle-mathews`,
  },
  {
    value: 'lee-byron',
    label: 'Lee Byron',
    avatar: `http://i.pravatar.cc/48?u=lee-byron`,
  },
  {
    value: 'michael-jackson',
    label: 'Michael Jackson',
    avatar: `http://i.pravatar.cc/48?u=michael-jackson`,
  },
  {
    value: 'paul-oshannessy',
    label: 'Paul O’Shannessy',
    avatar: `http://i.pravatar.cc/48?u=paul-oshannessy`,
  },
  {
    value: 'pete-hunt',
    label: 'Pete Hunt',
    avatar: `http://i.pravatar.cc/48?u=pete-hunt`,
  },
  {
    value: 'ryan-florence',
    label: 'Ryan Florence',
    avatar: `http://i.pravatar.cc/48?u=ryan-florence`,
  },
  {
    value: 'sebastian-markbage',
    label: 'Sebastian Markbåge',
    avatar: `http://i.pravatar.cc/48?u=sebastian-markbage`,
  },
  {
    value: 'sophie-alpert',
    label: 'Sophie Alpert',
    avatar: `http://i.pravatar.cc/48?u=sophie-alpert`,
  },
  {
    value: 'sunil-pai',
    label: 'Sunil Pai',
    avatar: `http://i.pravatar.cc/48?u=sunil-pai`,
  },
];

export const filterAssignees = inputValue => {
  return USERS.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase()),
  );
};
