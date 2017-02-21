const config = {
    httpServer: {
        hostname: 'localhost',
        port: 8080
    },
    sqlite: {
        filename: ':memory:',
//        filename: './db.sqlite/labels.sqlite',
        tablename: 'Labels'
    }
};

export default config;
