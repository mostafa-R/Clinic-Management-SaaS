export const sanitizeNoSQL = (req, res, next) => {
  const sanitizeObj = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      if (key.startsWith("$") || key.includes(".")) {
        console.warn(`⚠️  NoSQL injection attempt detected: ${key}`);
        delete obj[key];
        return;
      }

      if (typeof value === "object" && value !== null) {
        if (Array.isArray(value)) {
          obj[key] = value.map((item) =>
            typeof item === "object" ? sanitizeObj(item) : item
          );
        } else {
          obj[key] = sanitizeObj(value);
        }
      }
    });

    return obj;
  };

  if (req.body && typeof req.body === "object") {
    const sanitizedBody = sanitizeObj({ ...req.body });
    Object.keys(req.body).forEach((key) => delete req.body[key]);
    Object.assign(req.body, sanitizedBody);
  }

  if (req.query && Object.keys(req.query).length > 0) {
    const sanitizedQuery = sanitizeObj({ ...req.query });
    Object.keys(req.query).forEach((key) => delete req.query[key]);
    Object.assign(req.query, sanitizedQuery);
  }

  if (req.params && Object.keys(req.params).length > 0) {
    const sanitizedParams = sanitizeObj({ ...req.params });
    Object.keys(req.params).forEach((key) => delete req.params[key]);
    Object.assign(req.params, sanitizedParams);
  }

  next();
};

export const sanitizeXSS = (req, res, next) => {
  const cleanValue = (value) => {
    if (typeof value === "string") {
      value = value.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ""
      );

      value = value.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
      value = value.replace(/on\w+\s*=\s*[^\s>]*/gi, "");

      value = value.replace(/javascript:/gi, "");

      value = value.replace(/data:text\/html/gi, "");

      value = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      return value;
    }

    if (Array.isArray(value)) {
      return value.map(cleanValue);
    }

    if (typeof value === "object" && value !== null) {
      const cleaned = {};
      Object.keys(value).forEach((key) => {
        cleaned[key] = cleanValue(value[key]);
      });
      return cleaned;
    }

    return value;
  };

  if (req.body && typeof req.body === "object") {
    const sanitizedBody = cleanValue({ ...req.body });
    Object.keys(req.body).forEach((key) => delete req.body[key]);
    Object.assign(req.body, sanitizedBody);
  }

  if (req.query && Object.keys(req.query).length > 0) {
    const sanitizedQuery = cleanValue({ ...req.query });
    Object.keys(req.query).forEach((key) => delete req.query[key]);
    Object.assign(req.query, sanitizedQuery);
  }

  if (req.params && Object.keys(req.params).length > 0) {
    const sanitizedParams = cleanValue({ ...req.params });
    Object.keys(req.params).forEach((key) => delete req.params[key]);
    Object.assign(req.params, sanitizedParams);
  }

  next();
};

export const sanitizeHTML = (str) => {
  if (!str) return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};
