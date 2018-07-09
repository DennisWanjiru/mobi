const baseRoute = "https://mtracker-client.herokuapp.com/";

export const redirect = path => window.location.replace(`${baseRoute}${path}`);
