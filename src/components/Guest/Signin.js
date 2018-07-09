import { signinNodes } from "../utils/nodes";
import { redirect } from "../utils/routes";
import { Component } from "../utils/App";
import jwtDecode from "jwt-decode";
import api from "../utils/api";

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      errors: [],
      success: null
    };
    this.elements = signinNodes();
    this.submit = document.forms.signin.elements.submit;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange();
    this.handleSubmit();
    this.showLoaders();
  }

  showLoaders() {
    if (sessionStorage.success) {
      this.elements.username.parentNode.insertAdjacentHTML(
        "beforebegin",
        `<div class="alert-success mb-sm">${sessionStorage.success}</div>`
      );

      setTimeout(() => {
        sessionStorage.clear();
        location.reload();
      }, 1500);
    }

    setInterval(() => {
      if (this.state.isFetching) {
        this.submit.innerHTML = "Signing in...";
        this.submit.setAttribute("disabled", "disabled");
      } else {
        this.submit.innerHTML = "Sign in";
        this.submit.removeAttribute("disabled");
      }
    }, 0);
  }

  handleChange() {
    const data = { ...this.state.data };
    Object.values(this.elements).map(el => {
      el.addEventListener("change", e => {
        data[e.target.name] = e.target.value;
        this.setState({ data });
      });
    });
  }

  handleSubmit(e) {
    const errors = [...this.state.errors];
    this.submit.addEventListener("click", e => {
      e.preventDefault();
      this.setState({ isFetching: true });
      api
        .post("/users/auth/signin/", this.state.data)
        .then(res => {
          this.setState({ success: res.ok });
          return res.json();
        })
        .then(data => {
          this.setState({ isFetching: false });
          if (this.state.success) {
            const decoded = jwtDecode(data.access_token);
            sessionStorage.setItem("token", data.access_token);
            const isAdmin = decoded.identity.is_admin;
            isAdmin ? redirect("/dashboard/") : redirect("/requests/");
          } else {
            const errs = document.getElementsByClassName("errors");

            Object.entries(data).map(val => {
              errors[0] = val[1];
              this.setState({ errors });

              if (typeof val[1] === "object") {
                if (val[1].username) {
                  this.elements.username.classList.add("input--danger");
                  errs[0].innerHTML = this.state.errors[0].username;
                  if (errs[1].innerHTML !== "") {
                    this.elements.password.classList.replace(
                      "input--danger",
                      "input--success"
                    );
                    errs[1].innerHTML = "";
                  }
                } else {
                  if (errs[0].innerHTML !== "") {
                    this.elements.username.classList.replace(
                      "input--danger",
                      "input--success"
                    );
                    errs[0].innerHTML = "";
                  }

                  this.elements.password.classList.add("input--danger");
                  errs[1].innerHTML = this.state.errors[0].password;
                }
              } else {
                this.elements.username.classList.add("input--danger");
                this.elements.password.classList.add("input--danger");
                errs[0].innerHTML = this.state.errors[0];
                errs[1].innerHTML = this.state.errors[0];
              }
            });
          }
        })
        .catch(err => {
          this.setState({ isFetching: true });
          console.log(err.message);
        });
    });
  }
}

new Signin();
