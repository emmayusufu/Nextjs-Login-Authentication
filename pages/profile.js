import { getUserProfile } from "../lib/auth";
import Layout from "../components/Layout";

export default class Profile extends React.Component {
  state = {
    user: "Loading profile...",
  };

  componentDidMount() {
    getUserProfile().then((user) => this.setState({ user }));
  }

  render() {
    return (
      <Layout title="Profile">
        <pre>{JSON.stringify(this.state.user, null, 2)}</pre>
      </Layout>
    );
  }
}
