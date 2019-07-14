module.exports = {
    tags: {
        allowUnknownTags: ['category', 'extends', 'swagger']
    },
    source: {
        include: ["./src", 'README.md'],
        includePattern: ".js$",
        // exclude: ["./doc"],
        excludePattern: "(node_modules/|doc)"
    },
    plugins: [
        "plugins/markdown",
        "doc/typedef_extends",
        "node_modules/better-docs/category"
    ],
    opts: {
        template: "./node_modules/better-docs",
        encoding: "utf8",
        destination: "./doc/dist",
        recurse: true,
        verbose: true,
        tutorials: './doc/guide'
    },
    templates: {
        cleverLinks: false,
        monospaceLinks: false,
        default: {
            outputSourceFiles: false
        },
        "better-docs": {
            name: "BHive.js",
            "trackingCode": "tracking-code-which-will-go-to-the-HEAD",
            navigation: [{
                "label": "Github",
                "href": "https://github.com/upsidedownio/bhivejs"
            }, {
                "label": "Example Application",
                "href": "https://admin-bro-example-app.herokuapp.com/admin"
            }]
        }
    }
};
