import { neon } from "@neondatabase/serverless";

// Lazy initialization - only creates connection when first used
// This prevents build errors when DATABASE_URL is not set
let sqlInstance: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!sqlInstance) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      // During build phase, return a mock function to allow build to succeed
      // At runtime, this will throw when the API is actually called
      if (process.env.NEXT_PHASE === 'phase-production-build') {
        sqlInstance = (() => Promise.resolve([])) as unknown as ReturnType<typeof neon>;
      } else {
        throw new Error("DATABASE_URL is not set in environment variables");
      }
    } else {
      sqlInstance = neon(dbUrl);
    }
  }
  return sqlInstance;
}

// Template tag function with lazy initialization
export const sql = ((strings: TemplateStringsArray, ...values: any[]) => {
  return getSql()(strings, ...values);
}) as ReturnType<typeof neon>;

