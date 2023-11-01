// Model that is responsible for collected our page name from our url and then moving data to replace current html information.
// Our Mdel also incorpurates a call back function that makes sure external functions are run after a page has propperly loaded.

var MODEL = (() => {
    let _changeContent = (page, callback) => {
        $.get(`pages/${page}/${page}.html`, (data) => {
            try {
                $("#app").html(data);
                if (callback) {
                    callback(page);
                }
            } catch (e) {
                console.log("Error found in model page: " + e);
                alert(e);
            }
        });
    };
    return { changeContent: _changeContent };
})();