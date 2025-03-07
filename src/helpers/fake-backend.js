import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

export const fakeUsers = [
  {
    id: "1",
    email: "admin@coderthemes.com",
    username: "admin",
    password: "password",
    firstName: "Admin",
    lastName: "Coderthemes",
    role: "admin",
    token:
      "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImF1ZCI6ImNvZGVydGhlbWVzLmNvbSIsInN1YiI6InN1cHBvcnRAY29kZXJ0aGVtZXMuY29tIiwibGFzdE5hbWUiOiJDb2RlcnRoZW1lcyIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJUZXN0VG9rZW4ifQ.1StUQa0dF1HZ5gwyfhXPcvxqQSYEiGXk6QbbsvVKXGNQLt0bdTlcf0sOwvZPyOgMbEyoMQHBOfn9nAOMQmhWoA",
  },
  {
    id: "2",
    email: "user@coderthemes.com",
    username: "user",
    password: "password",
    firstName: "User",
    lastName: "Coderthemes",
    role: "user",
    token:
      "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImF1ZCI6ImNvZGVydGhlbWVzLmNvbSIsInN1YiI6InN1cHBvcnRAY29kZXJ0aGVtZXMuY29tIiwibGFzdE5hbWUiOiJDb2RlcnRoZW1lcyIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJUZXN0VG9rZW4ifQ.1StUQa0dF1HZ5gwyfhXPcvxqQSYEiGXk6QbbsvVKXGNQLt0bdTlcf0sOwvZPyOgMbEyoMQHBOfn9nAOMQmhWoA",
  },
];

export default function configureFakeBackend() {
  mock.onPost("/login").reply(function (config) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise(function (resolve, _reject) {
      setTimeout(function () {
        // get parameters from post request
        const params = JSON.parse(config.data);
        // find if any user matches login credentials
        const filteredUsers = fakeUsers.filter((user) => {
          return (
            user.email === params.email && user.password === params.password
          );
        });

        if (filteredUsers.length) {
          // if login details are valid return user details and fake jwt token
          const user = filteredUsers[0];
          resolve([200, user]);
        } else {
          // else return error
          resolve([401, { error: "Username or password is incorrect" }]);
        }
      }, 1000);
    });
  });
}
