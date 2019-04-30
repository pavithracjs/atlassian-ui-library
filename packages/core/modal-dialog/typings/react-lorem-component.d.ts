declare module 'react-lorem-component' {
  export interface LoremProps {
    count: number | string;
  }

  class Lorem extends React.Component<LoremProps> {}
  export default Lorem;
}
