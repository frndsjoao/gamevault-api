import axios from "axios";

export const apiAuth = axios.create({
  baseURL: "https://id.twitch.tv/oauth2"
})

export const api = axios.create({
  baseURL: "https://api.igdb.com/v4"
})