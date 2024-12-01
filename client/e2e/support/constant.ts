const serverURL = (path: string) => {
  return "http://localhost:8000" + path;
};

export const API_ROUTES = {
  LOGIN: serverURL("/api/auth/login"),
  CHECK_MODERATOR: serverURL("/api/auth/check-moderator"),
  CREATE_MODERATOR: serverURL("/api/auth/create-moderator"),
  GAME_LIST: serverURL("/api/review/list-review"),
  GAME_DETAILS: serverURL("/api/review/get-review"),
  ADD_GAME_REVIEW: serverURL("/api/review/update-review"),
  GET_MAP_DATA: serverURL("/api/review/map-data"),
  CREATE_NEW_GAME: serverURL("/api/review/new-review"),
  UPDATE_GAME: serverURL("/api/review/update-review"),
  DELETE_GAME: serverURL("/api/review/delete-review"),
};
