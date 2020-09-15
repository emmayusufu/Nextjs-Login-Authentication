import { auth } from "../lib/auth";
import Router from "next/router";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "Sincere@april.biz",
      password: "hildegard.org",
      error: "",
      isLoading: false,
    };
  }

  handlechange = (event) => {
    // console.log(event);
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = (event) => {
    const { email, password } = this.state;
    event.preventDefault();
    this.setState({ error: "", isLoading: true });
    auth(email, password)
      .then(() => {
        Router.push("/profile");
      })
      .catch(this.showError);

    // console.log(this.state);
  };

  showError = (err) => {
    console.log(err);
    const error = (err.response && err.response.data) || err.message;
    this.setState({ error, isLoading: false });
  };

  render() {
    const { email, password, error, isLoading } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <input
            name="email"
            type="email"
            value={email}
            placeholder="email"
            onChange={this.handlechange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="password"
            onChange={this.handlechange}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "sending" : "submit"}
        </button>
        {error && <div>{error}</div>}
      </form>
    );
  }
}
