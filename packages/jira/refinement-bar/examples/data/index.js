// @noflow

const USERS = [
  {
    value: 'dan-abromov',
    label: 'Dan Abromov',
    avatar: `http://i.pravatar.cc/48?u=dan-abromov`,
  },
  {
    value: 'kyle-mathews',
    label: 'Kyle Mathews',
    avatar: `http://i.pravatar.cc/48?u=kyle-mathews`,
  },
  {
    value: 'brian-vaughn',
    label: 'Brian Vaughn',
    avatar: `http://i.pravatar.cc/48?u=brian-vaughn`,
  },
  {
    value: 'sunil-pai',
    label: 'Sunil Pai',
    avatar: `http://i.pravatar.cc/48?u=sunil-pai`,
  },
  {
    value: 'michael-jackson',
    label: 'Michael Jackson',
    avatar: `http://i.pravatar.cc/48?u=michael-jackson`,
  },
  {
    value: 'ryan-florence',
    label: 'Ryan Florence',
    avatar: `http://i.pravatar.cc/48?u=ryan-florence`,
  },
  {
    value: 'kent-c-dodds',
    label: 'Kent C. Dodds',
    avatar: `http://i.pravatar.cc/48?u=kent-c-dodds`,
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
    value: 'andrew-clark',
    label: 'Andrew Clark',
    avatar: `http://i.pravatar.cc/48?u=andrew-clark`,
  },
  {
    value: 'sophie-alpert',
    label: 'Sophie Alpert',
    avatar: `http://i.pravatar.cc/48?u=sophie-alpert`,
  },
  {
    value: 'brian-vaughn',
    label: 'Brian Vaughn',
    avatar: `http://i.pravatar.cc/48?u=brian-vaughn`,
  },
  {
    value: 'ken-wheeler',
    label: 'Ken Wheeler',
    avatar: `http://i.pravatar.cc/48?u=ken-wheeler`,
  },
  {
    value: 'ken-wheeler',
    label: 'Ken Wheeler',
    avatar: `http://i.pravatar.cc/48?u=ken-wheeler`,
  },
  {
    value: 'lee-byron',
    label: 'Lee Byron',
    avatar: `http://i.pravatar.cc/48?u=lee-byron`,
  },
  {
    value: 'sebastian-markbage',
    label: 'Sebastian Markbåge',
    avatar: `http://i.pravatar.cc/48?u=sebastian-markbage`,
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
    value: 'cheng-lou',
    label: 'Cheng Lou',
    avatar: `http://i.pravatar.cc/48?u=cheng-lou`,
  },
  {
    value: 'christopher-chedeau',
    label: 'Christopher Chedeau',
    avatar: `http://i.pravatar.cc/48?u=christopher-chedeau`,
  },
];

export const filterAssignees = inputValue => {
  return USERS.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase()),
  );
};
