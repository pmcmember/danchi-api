const { exec, ExecException } = require("child_process");

exports.execComUtil = (com) => {
    return new Promise((resolve, reject) => {
        exec(com, (err, stdout, stderr) => {
            if(err) {
                reject(new Error(stderr));
            } else {
                resolve(stdout);
            }
        })
    })
}