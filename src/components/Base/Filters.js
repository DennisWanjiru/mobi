import { Component } from "../utils/App";
import { filterNodes } from "../utils/nodes";

class Filters extends Component {
  constructor(props) {
    super(props);
    this.filters = filterNodes();
    this.handleFilter();
  }

  handleFilter(filter) {
    Object.entries(this.filters).map(value => {
      value[1].addEventListener("click", e => {
        e.preventDefault();
        this.props.update(value[0]);
      });
    });
  }
}

export default Filters;
