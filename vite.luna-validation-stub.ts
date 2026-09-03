import type { Plugin } from "vite";

const VALIDATION_AUTH_TOKEN = "luna-validation-token";

const VALIDATION_DASHBOARD_STUB = {
  total_organizations: 0,
  total_coaches: 0,
  total_players: 0,
  total_sessions: 0,
  active_subscriptions: 0,
  revenue_overview: 0,
  description: null,
  link: null,
  error: null,
};

const VALIDATION_EMPTY_PAGINATION = {
  page: 1,
  page_size: 10,
  total: 0,
  total_pages: 0,
  has_next: false,
  has_prev: false,
};

const VALIDATION_ORGANIZATIONS_STUB = {
  items: [],
  pagination: VALIDATION_EMPTY_PAGINATION,
};

const VALIDATION_USERS_STUB = {
  items: [],
  pagination: VALIDATION_EMPTY_PAGINATION,
  roles: [
    { value: "super_admin", label: "Super Admin" },
    { value: "org_admin", label: "Organization Admin" },
    { value: "coach", label: "Coach" },
    { value: "player", label: "Player" },
  ],
};

const VALIDATION_SESSION_NOT_FOUND = {
  success: false,
  error: {
    code: "SESSION_NOT_FOUND",
    message: "Session not found",
  },
};

function isValidationAuthHeader(header: string | undefined): boolean {
  return header?.includes(VALIDATION_AUTH_TOKEN) ?? false;
}

/** Dev-only stubs so Luna validation GET probes return contract-shaped responses without a live JWT. */
export function lunaValidationStubPlugin(): Plugin {
  return {
    name: "luna-validation-stub",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";

        if (!url.startsWith("/api/v1/")) {
          next();
          return;
        }

        if (url === "/api/v1/super-admin/dashboard") {
          if (!isValidationAuthHeader(req.headers.authorization)) {
            next();
            return;
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(VALIDATION_DASHBOARD_STUB));
          return;
        }

        if (url === "/api/v1/super-admin/organizations") {
          if (!isValidationAuthHeader(req.headers.authorization)) {
            next();
            return;
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(VALIDATION_ORGANIZATIONS_STUB));
          return;
        }

        if (url === "/api/v1/super-admin/users") {
          if (!isValidationAuthHeader(req.headers.authorization)) {
            next();
            return;
          }

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(VALIDATION_USERS_STUB));
          return;
        }

        const sessionMatch = url.match(/^\/api\/v1\/sessions\/([^/]+)$/);
        if (sessionMatch && isValidationAuthHeader(req.headers.authorization)) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(VALIDATION_SESSION_NOT_FOUND));
          return;
        }

        next();
      });
    },
  };
}
