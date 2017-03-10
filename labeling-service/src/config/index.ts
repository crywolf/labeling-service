const config = {
    httpServer: {
        hostname: 'localhost',
        port: 8080
    },
    sqlite: {
//        filename: ':memory:',
        filename: './db.sqlite/labels.sqlite',
        labelsTable: 'Labels',
        restrictionsTable: 'Restrictions'
    }
};

export default config;
