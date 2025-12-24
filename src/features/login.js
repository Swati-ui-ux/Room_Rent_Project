import { setUser, setLoading } from "./authSlice";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

export const loginUser = (email, password) => async (dispatch) => {
  const auth = getAuth();
  try {
    dispatch(setLoading(true));
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    dispatch(setUser(userCredential.user));
  } catch (err) {
    console.error(err);
  } finally {
    dispatch(setLoading(false));
  }
};
