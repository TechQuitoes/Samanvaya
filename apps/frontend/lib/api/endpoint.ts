export const authEndpoints = {
  POST_SIGNUP: '/auth/signup',
  POST_LOGIN: '/auth/login',
  GET_PROFILE: '/auth/me',
};

export const userEndpoints = {
  GET_USERS: '/users',
  POST_CREATE_USER: '/users',
  GET_USER_BY_ID: '/users/{id}',
};

export const templeEndpoints = {
  GET_TEMPLES: '/temples',
  POST_CREATE_TEMPLE: '/temples',
};

export const adminEndpoints = {
  GET_PENDING_USERS: '/users/pending',
  GET_REJECTED_USERS: '/users/rejected',
  GET_USERS_BY_STATUS: '/users/status/{status}',
  PATCH_USER_STATUS: '/users/{id}/status',
};

export const leaderProfileEndpoints = {
  GET_LEADER_PROFILE: '/leader-profile',
  PATCH_LEADER_PROFILE: '/leader-profile',
  PATCH_LEADER_LOCATION_STATUS: '/leader-profile/location-status',
};

export const travelEndpoints = {
  GET_TRAVELS: '/travel',
  POST_CREATE_TRAVEL: '/travel',
  GET_TRAVEL_BY_ID: '/travel/{id}',
  PATCH_UPDATE_TRAVEL: '/travel/{id}',
  POST_ADD_TRAVEL_EXPENSE: '/travel/{id}/expenses',
  DELETE_TRAVEL: '/travel/{id}',
  GET_TRAVEL_TASKS: '/travel/{id}/tasks',
  POST_CREATE_TRAVEL_TASK: '/travel/{id}/tasks',
  PATCH_UPDATE_TRAVEL_TASK: '/travel/tasks/{taskId}',
};
