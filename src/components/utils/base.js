import { redirect } from "./routes";
import jwtDecode from "jwt-decode";

class Base {
  constructor() {
    if (sessionStorage.length === 0 && location.pathname === "/index.html") {
      this.handleMobileView();
    } else if (sessionStorage.token) {
      this.render();
      this.handleSignout();
      this.toggleSignout();
      this.handleMobileView();
    }
  }

  handleSignout() {
    const decoded = jwtDecode(sessionStorage.token);
    const user = decoded.identity;
    setTimeout(() => {
      if (!user.is_admin) {
        logout.addEventListener("click", () => {
          sessionStorage.clear();
          redirect("/auth/signin/");
        });
      }
      signout.addEventListener("click", () => {
        sessionStorage.clear();
        redirect("/auth/signin/");
      });
    }, 1000);
  }

  handleMobileView() {
    const decoded = jwtDecode(sessionStorage.token);
    const user = decoded.identity;

    if (!user.is_admin) {
      const hamburger = document.getElementById("hamburger");
      const mobileNav = document.getElementById("mobile-nav").classList;
      const body = document.querySelector("body").classList;

      hamburger.addEventListener("click", () => {
        if (mobileNav.contains("hidden")) {
          mobileNav.replace("hidden", "show-on-mobile");
          body.add("no-overflow");
        } else {
          mobileNav.replace("show-on-mobile", "hidden");
          body.remove("no-overflow");
        }
      });
    }
  }

  toggleSignout() {
    const decoded = jwtDecode(sessionStorage.token);
    const user = decoded.identity;
    if (!user.is_admin) {
      setTimeout(() => {
        const signoutClasses = document.querySelector("#signout").classList;
        const signoutBtn = document.querySelector("#signout-btn");
        signoutBtn.addEventListener("click", () => {
          if (signoutClasses.contains("hidden")) {
            signoutClasses.replace("hidden", "dropdown__content");
            signoutClasses.add("dropdown--signout");
          } else {
            signoutClasses.replace("dropdown__content", "hidden");
            signoutClasses.remove("dropdown--signout");
          }
        });
      }, 1000);
    }
  }

  render() {
    const decoded = jwtDecode(sessionStorage.token);
    const user = decoded.identity;
    if (!user.is_admin) {
      mobile.innerHTML = `
        <div class="brand brand--mobile hr">
      <span>M-tracker</span>
    </div>
    <ul sidebar__nav>
      <li class="sidebar__link-item mobile-item">
        <a href="/" class="link link--sidebar mobile-link">Home</a>
        <svg class="icon icon--sidebar mobile-icon">
          <use xlink:href="/assets/icons/sprite.svg#icon-home-lite"></use>
        </svg>
      </li>
      <li class="sidebar__link-item mobile-item">
        <a href="/requests/" class="link link--sidebar mobile-link">Requests</a>
        <svg class="icon icon--sidebar mobile-icon">
          <use xlink:href="/assets/icons/sprite.svg#icon-layers"></use>
        </svg>
      </li>
      <li class="sidebar__link-item mobile-item">
        <a href="/requests/new/" class="link link--sidebar mobile-link">Make request</a>
        <svg class="icon icon--sidebar mobile-icon">
          <use xlink:href="/assets/icons/sprite.svg#icon-activity"></use>
        </svg>
      </li>
      <li id="logout" class="sidebar__link-item mobile-item">
        <a class="link link--sidebar mobile-link">Sign out</a>
        <svg class="icon icon--sidebar mobile-icon">
          <use xlink:href="/assets/icons/sprite.svg#icon-log-out"></use>
        </svg>
      </li>
    </ul>
      `;

      nav.innerHTML = `
      <ul class="nav--right">
        <li class="nav__item">
          <a href="/requests/" class="nav__link">Requests</a>
        </li>
        <li class="nav__item">
          <a href="/requests/new/" class="nav__link">Make Request</a>
        </li>
        <button class="btn--dropdown" id="signout-btn">
          ${user.name}
          <svg class="icon">
            <use xlink:href="/assets/icons/sprite.svg#icon-chevron-down"></use>
          </svg>
        </button>

        <div id="signout" class="hidden">
          <a href="#">Sign out</a>
        </div>
      </ul>

        `;
    }
  }
}

export default Base;
