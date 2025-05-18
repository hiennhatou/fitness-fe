import axios from "axios";
import { useUserState } from "../../app/globalState";

export async function loadUser(isLogin: boolean = false) {
  const isLoadedUser = useUserState.getState().isLoaded;
  const user = useUserState.getState().user;

  const token = localStorage.getItem("token");
  
  if (token && (isLogin || !(isLoadedUser || user)))
    try {
      const data = await axios.get(`${import.meta.env.VITE_API_HOST}/secure/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (data.status === 200) {
        useUserState.setState({ user: data.data, isLoaded: true });
        return;
      }
    } catch (err: unknown) {
      console.log(err);
    }

    useUserState.setState({user: null, isLoaded: true});
}
