function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const env = {
  baseUrl: required('BASE_URL'),
  password: required('PASSWORD'),
  users: {
    standard: required('STANDARD_USER'),
    locked: required('LOCKED_USER'),
    problem: required('PROBLEM_USER'),
    performance: required('PERFORMANCE_USER'),
    error: required('ERROR_USER'),
    visual: required('VISUAL_USER'),
  },
};
