// Resolves database URL: DATABASE_URL, DATABASE_URL_PRIVATE, or DATABASE_URL_PUBLIC
module.exports =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_PRIVATE ||
  process.env.DATABASE_URL_PUBLIC;
