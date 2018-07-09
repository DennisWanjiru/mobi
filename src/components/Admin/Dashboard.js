import { Component } from "../utils/App";
import { dashboardNodes } from "../utils/nodes";
import api from "../utils/api";
import { redirect } from "../utils/routes";
import Filters from "../Base/Filters";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isFetching: false,
      isAdmin: false,
      data: {},
      stats: {
        all: 0,
        pending: 0,
        approved: 0,
        resolved: 0,
        rejected: 0
      },
      status: 0,
      token: null
    };

    new Filters({ update: this.handleDataUpdate });
    this.elems = dashboardNodes();
    this.handleTokenUpdate();
    this.fetchRequests();
  }

  handleTokenUpdate() {
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
      content.classList.remove("flex-center");
      this.render();
    } else {
      const newData = prevData.requests.filter(request => {
        return request.status === filters || request.request_type === filters;
      });

      if (newData.length !== 0) {
        content.classList.remove("flex-center");
        let data = { requests: newData };
        this.setState({ data });
        this.render();
      } else {
        content.classList.add("flex-center");
        content.innerHTML = `<h1>There are no any ${filters} requests<h1/>`;
      }
    }

    setTimeout(() => {
      const data = prevData;
      this.setState({ data });
    }, 0);
  }

  fetchRequests() {
    setTimeout(() => {
      if (this.state.isAuthenticated) {
        api
          .get("/requests/", this.state.token)
          .then(res => {
            res.status === 403
              ? this.setState({ isAdmin: false })
              : this.setState({ isAdmin: true });
            return res.json();
          })
          .then(data => {
            if (this.state.isAdmin) {
              const hasExpired = Object.values(data).includes(
                "Token has expired"
              );
              if (hasExpired) {
                sessionStorage.removeItem("token");
                redirect("/auth/signin/");
              } else {
                const stats = { ...this.state.stats };
                stats.all = data.requests.length;
                this.setState({ stats });
                data.requests.map(request => {
                  if (request.status === "pending") {
                    stats.pending = stats.pending + 1;
                    this.setState({ stats });
                  } else if (request.status === "approved") {
                    stats.approved = stats.approved + 1;
                    this.setState({ stats });
                  } else if (request.status === "resolved") {
                    stats.resolved = stats.resolved + 1;
                    this.setState({ stats });
                  } else if (request.status === "rejected") {
                    stats.rejected = stats.rejected + 1;
                    this.setState({ stats });
                  }
                });
                this.setState({ data });
                this.render();
              }
            } else {
              redirect("/errors/403.html");
            }
          })
          .catch(err => console.log(err));
      } else {
        redirect("/auth/signin/");
      }
    });
  }

  render() {
    const tableHeader = `
      <div class="hr row--table table__header">
          <div class="table__data th table__data--md">Title</div>
          <div class="table__data th table__data--lg">Description</div>
          <div class="table__data th">Date</div>
          <div class="table__data th">Requester</div>
          <div class="table__data th">Type</div>
          <div class="table__data th">Status</div>
      </div>
  `;

    const { all, pending, approved, resolved, rejected } = this.state.stats;

    this.elems.all.innerHTML = all;
    this.elems.pending.innerHTML = pending;
    this.elems.approved.innerHTML = approved;
    this.elems.resolved.innerHTML = resolved;
    this.elems.rejected.innerHTML = rejected;

    this.elems.content.innerHTML =
      tableHeader +
      this.state.data.requests.map(
        request => `
          <a href="details/?${request.public_id}" class="table--link">
            <div class="hr row--table">
            <div class="table__data table__data--md">
              ${
                request.title.length > 22
                  ? request.title.substr(0, 22) + "..."
                  : request.title
              }
            </div>
            <div class="table__data table__data--lg">
              ${
                request.description.length > 40
                  ? request.description.substr(0, 40) + "..."
                  : request.description
              }
            </div>
            <div class="table__data">Nov 27, 2018</div>
            <div class="table__data">${request.user_id}</div>
            <div class="table__data">${request.request_type}</div>
            <div class="table__data">
              <em>${request.status}</em>
            </div>
          </div>
        </a>`
      );
  }
}
const dashboard = new Dashboard();
