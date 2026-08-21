export const authEndpoints = {
  POST_SIGNUP: '/auth/signup',
  POST_LOGIN: '/auth/login',
  POST_GOOGLE_AUTH: '/auth/google',
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

export const notificationEndpoints = {
  GET_NOTIFICATIONS: '/notifications',
  GET_VAPID_PUBLIC_KEY: '/notifications/vapid-public-key',
  POST_SUBSCRIBE_PUSH: '/notifications/subscribe',
  POST_UNSUBSCRIBE_PUSH: '/notifications/unsubscribe',
  PATCH_MARK_NOTIFICATION_READ: '/notifications/{id}/read',
  PATCH_MARK_ALL_NOTIFICATIONS_READ: '/notifications/read-all',
};

export const mediaEndpoints = {
  POST_GENERATE_PRESIGNED_URL: '/media/presigned-url',
};


