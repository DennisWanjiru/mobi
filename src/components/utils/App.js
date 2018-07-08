import Base from "./base";

export class Component {
  constructor(props) {
    this.props = props;
    this.setState = this.setState.bind(this);
    new Base();
  }

  setState(newState) {
    return Object.assign(this.state, newState);
  }
}
