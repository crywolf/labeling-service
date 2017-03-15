const config = {
    httpServer: {
        hostname: 'localhost',
        port: 5000
    },
    sqlite: {
        filename: ':memory:',
        labelsTable: 'Labels',
        restrictionsTable: 'Restrictions'
    }
};

export default config;
