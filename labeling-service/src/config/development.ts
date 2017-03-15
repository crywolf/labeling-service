const config = {
    httpServer: {
        hostname: 'localhost',
        port: 8000
    },
    sqlite: {
        filename: './db.sqlite/labels.sqlite',
        labelsTable: 'Labels',
        restrictionsTable: 'Restrictions'
    }
};

export default config;
