import { useUserState } from "../../app/globalState";
import { secureApi } from "../http";

export async function loadUser(isLogin: boolean = false) {
  const isLoadedUser = useUserState.getState().isLoaded;
  const user = useUserState.getState().user;

  if (isLogin || !(isLoadedUser || user)) {
    try {
      const data = await secureApi.get(`/me`);
      if (data.status === 200) {
        useUserState.setState({ user: data.data, isLoaded: true });
        return data.data;
      }
    } catch (err: unknown) {
      console.log(err);
    }

    useUserState.setState({ user: null, isLoaded: true });
  }
}
