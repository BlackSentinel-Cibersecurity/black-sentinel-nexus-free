const dbConfig = {
  type: (process.env.DATABASE_TYPE || 'sqlite') as 'sqlite' | 'postgres',
  sqlite: {
    database: process.env.DATABASE_PATH || './black_sentinel.db',
  },
  postgres: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    database: process.env.DATABASE_NAME || 'blacksentinel',
    username: process.env.DATABASE_USER || 'bsn_user',
    password: process.env.DATABASE_PASSWORD || '',
  },
};

export default dbConfig;
