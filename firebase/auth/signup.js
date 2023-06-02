import { firebase_app, auth, db } from "../config";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default async function signUp(email, password) {
    let result = null,
        error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}