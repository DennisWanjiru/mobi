import api from "../utils/api";
import { Component } from "../utils/App";
import { redirect } from "../utils/routes";
import { signupNodes } from "../utils/nodes";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      errors: {},
      success: null,
      isFetching: false
    };
    this.elements = signupNodes();
    this.submit = document.forms.signup.elements.submit;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange();
    this.handleSubmit();
    this.showLoaders();
  }

  showLoaders() {
    setInterval(() => {
      if (this.state.isFetching) {
        this.submit.innerHTML = "Signing up...";
        this.submit.setAttribute("disabled", "disabled");
      } else {
        this.submit.innerHTML = "Sign up";
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
    let errors = { ...this.state.errors };
    this.submit.addEventListener("click", e => {
      e.preventDefault();
      this.setState({ isFetching: true });
      api
        .post("/users/auth/signup/", this.state.data)
        .then(res => {
          this.setState({ success: res.ok });
          return res.json();
        })
        .then(data => {
          this.setState({ isFetching: false });
          if (this.state.success) {
            sessionStorage.setItem("success", data.message);
            redirect("/auth/signin/");
          } else {
            Object.values(data).map(value => {
              if (typeof value === "object") {
                Object.entries(value).map(val => {
                  errors = {};
                  errors[val[0]] = val[1];
                  this.setState({ errors });
                  if (this.state.errors) {
                    Object.entries(this.elements).map(el => {
                      let err = { ...this.state.errors };
                      if (err[el[0]]) {
                        el[1].classList.add("input--danger");
                        el[1].parentNode.insertAdjacentHTML(
                          "afterend",
                          `<div class='errors'>${err[el[0]]}</div>`
                        );
                      }
                    });
                  }
                });
              } else {
                const err = document.getElementById("err");
                if (err) {
                  err.remove(err);
                }
                this.elements.name.parentNode.insertAdjacentHTML(
                  "beforebegin",
                  `<div class="alert-danger mb-sm" id="err">${value}</div>`
                );
              }
            });
          }
        })
        .catch(err => {
          this.setState({ isFetching: false });
        });
    });
  }
}

const signup = new Signup();
