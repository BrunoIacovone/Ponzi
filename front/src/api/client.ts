import { api } from "./config";

export async function createUser() {
    await api.post('/user')
}