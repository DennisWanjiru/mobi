import api from "../utils/api";
import { Component } from "../utils/App";
import { redirect } from "../utils/routes";
import { requestsNodes } from "../utils/nodes";
import Dropdown from "../Base/Dropdown";
import Filters from "../Base/Filters";
import jwtDecode from "jwt-decode";

class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isFetching: false,
      success: null,
      data: null,
      status: 0,
      token: null
    };
    this.handleDataUpdate = this.handleDataUpdate.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.elems = requestsNodes();
    this.handleTokenUpdate();
    this.fetchRequests();
    this.showLoaders();
    new Filters({ update: this.handleDataUpdate });
    this.handleSearch();
    new Dropdown();
  }

  showLoaders() {
    setInterval(() => {
      this.state.isFetching &&
        (this.elems.root.innerHTML = "<h1>Getting Your Requests...</h1>");
    }, 0);
  }

  handleTokenUpdate() {
    const toke = sessionStorage.token;
    const decoded = jwtDecode(toke);
    setInterval(() => {
      const token = sessionStorage.getItem("token");
      token
        ? this.setState({ token, isAuthenticated: true })
        : this.setState({ token: null, isAuthenticated: false });
    }, 0);
  }

  handleDataUpdate(filters) {
    const prevData = { ...this.state.data };

    if (filters === "all") {
      this.render();
    } else {
      const newData = prevData.requests.filter(request => {
        return request.status === filters || request.request_type === filters;
      });

      if (newData.length !== 0) {
        let data = { requests: newData };
        this.setState({ data });
        this.render();
      } else {
        root.innerHTML = `<h1>There are no any ${filters} requests<h1/>`;
      }
    }

    setTimeout(() => {
      const data = prevData;
      this.setState({ data });
    }, 0);
  }

  handleSearch() {
    const requests = new Promise((resolve, reject) => {
      setInterval(() => {
        if (this.state.data) {
          resolve(this.state.data);
        }
      }, 0);
    });

    requests.then(res => {
      const prevData = { ...res };
      let data;
      search.addEventListener("keyup", e => {
        const term = e.target.value.toLowerCase();
        const requests = prevData.requests.filter(
          ({ title, description, request_type, status }) =>
            title.toLowerCase().indexOf(term) !== -1 ||
            description.toLowerCase().indexOf(term) !== -1 ||
            request_type.toLowerCase().indexOf(term) !== -1 ||
            status.toLowerCase().indexOf(term) !== -1
        );

        data = { requests };
        this.setState({ data });
        this.render();
      });
    });
  }

  fetchRequests() {
    const [root, total, filters] = Object.values(this.elems);
    setTimeout(() => {
      if (this.state.isAuthenticated) {
        this.setState({ isFetching: true });
        api
          .get("/users/requests/", this.state.token)
          .then(res => {
            this.setState({
              success: res.ok,
              status: res.status
            });
            return res.json();
          })
          .then(data => {
            this.setState({ isFetching: false });
            if (this.state.success) {
              this.setState({ data });
              filters.classList.remove("hidden");
              this.render();
            } else {
              if (this.state.status === 404) {
                root.innerHTML = `
                  <h1>
                    ${data.message}. Make a new request
                    <a href="https://mtracker-client.herokuapp.com/requests/new/">here</a>
                  </h1>`;
              } else {
                const hasExpired = Object.values(data).includes(
                  "Token has expired"
                );
                if (hasExpired) {
                  sessionStorage.removeItem("token");
                  redirect("/auth/signin/");
                }
              }
            }
          });
      } else {
        redirect("/auth/signin/");
      }
    }, 0);
  }

  render() {
    total.innerHTML = `(${this.state.data.requests.length})`;
    root.innerHTML = this.state.data.requests.map(
      request => `
            <div class="col col--3">
                <a href="view/?${request.public_id}" class="link">
                  <div class="card card--request">
                  <div class="card__header hr">
                      <h1>${request.title}</h1>
                      <p class="date">Sep 20th</p>
                  </div>
                  <div class="card__content hr">
                      <p>
                      ${
                        request.description.length > 84
                          ? request.description.substr(0, 84) + "..."
                          : request.description
                      }
                    </p>
                  </div>
                  <div class="card__footer">
                      <em>${request.request_type}</em>
                      <span class="status status--${request.status}">
                      <p>${request.status}</p>
                      </span>
                  </div>
                  </div>
                </a>
            </div>
          `
    );
  }
}

const requests = new Requests();
