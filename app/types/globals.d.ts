export {};
declare global {
  type ReactComponent =
    | React.JSX.Element
    | React.ReactNode
    | React.ReactElement
    | Array<React.JSX.Element>
    | Array<React.ReactNode>
    | Array<React.ReactElement>
    | null
    | undefined;
}
