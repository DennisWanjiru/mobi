import { Component } from "../utils/App";

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.filterClasses = document.querySelector("#filters").classList;
    this.sortClasses = document.querySelector("#sort").classList;
    this.sortBtn = document.querySelector("#sort-btn");
    this.filterBtn = document.querySelector("#filter-btn");
    this.handleFilter();
    this.handleSort();
    this.closeDropdown();
  }

  toggleDropdown(searchType) {
    if (searchType.contains("hidden")) {
      searchType.replace("hidden", "dropdown__content");
    } else {
      searchType.replace("dropdown__content", "hidden");
    }
  }

  handleFilter() {
    this.filterBtn.addEventListener("click", () =>
      this.toggleDropdown(this.filterClasses)
    );
  }

  handleSort() {
    this.sortBtn.addEventListener("click", () =>
      this.toggleDropdown(this.sortClasses)
    );
  }

  closeDropdown() {
    window.addEventListener("click", e => {
      if (!e.target.matches(".btn--dropdown")) {
        this.filterClasses.remove("dropdown__content");
        this.filterClasses.add("hidden");
        this.sortClasses.remove("dropdown__content");
        this.sortClasses.add("hidden");
      }
    });
  }
}

export default Dropdown;
