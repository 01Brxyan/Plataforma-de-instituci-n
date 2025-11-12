
let state = { view: "home" };


function render() {
  const app = document.getElementById("app");

  if (state.view === "home") {
    console.log("Vista: Home");
  } else if (state.view === "login") {
    console.log("Vista: Login");
  }
}


document.getElementById("home-link").addEventListener("click", () => {
  state.view = "home";
  render();
});

document.getElementById("login-link").addEventListener("click", () => {
  state.view = "login";
  render();
});

render();
