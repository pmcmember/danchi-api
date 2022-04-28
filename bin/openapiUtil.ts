const { execComUtil } = require("./execComUtil");
const fs  = require('fs')
const { exit } = require("process");
const {
    is_windows,
    is_mac,
    is_linux
} = require('./os');

const action = process.argv[2]
const dockerComposePath = process.argv[3]
const ports = {
    view: 8002
}

if( ! action) {
    throw new Error(`[ERROR]Please specify following action as FIRST argument.\n\tstart\n\topen\n\tstop\n\tquit`);
}

if( ! dockerComposePath || ! fs.existsSync(dockerComposePath)) {
    throw new Error("[ERROR]Please specify file of docker-compose path as SECOND argument.");
}



const getDockerUrl = () => {
    const dockerIp = process.env.DOCKER_HOST
        ? process.env.DOCKER_HOST.split(":")[1].replace(/\//g, "")
        : "localhost"
    const url = `http://${dockerIp}`;
    
    return `${url}:${ports.view}`;
}

const openBrowser = async (url: string): Promise<string> => {
    let com: string;

    if(is_windows) {
        com = `start ${url}`
    } else if(is_mac || is_linux) {
        com = `open ${url}`
    } else {
        return Promise.reject(new Error("[ERROR]Your Platform is not supported."))
    }

    return execComUtil(com)
}

const startCom = (): Promise<void> => {
    return execComUtil(`docker-compose --file ${dockerComposePath} up -d`)
    .then(() => {
        console.log("Run Open API document browsing environment is complete.");
        console.log("");

        return getDockerUrl()
    })
    .then((url: string) => {
        openBrowser(url)
        .then(() => {
            return execComUtil("docker ps");
        })
        .then(() => {
            console.log("");
            console.log(`swagger-ui url : http:${url.split(":")[1]}:${ports.view}`);
        })
    })
    .then(() => {
        console.log("")
        console.log("Run Open API document browsing environment is complete.");
    })
}

const openCom = () => {
    const url = getDockerUrl()
    return openBrowser(url)
        .then(() => {
            console.log(`url : ${url}`)
        })
        .catch(() => {
            console.error("[ERROR]Open Browser is failed.")
            console.log(`url : ${url}`)
        })
}

const stopCom = (): Promise<void> => {
    return execComUtil(`docker-compose --file ${dockerComposePath} stop`)
    .then((result: string | undefined) => {
        console.log(result);
        console.log("Stop Open API document browsing environment is complete.");
    })
    
}

const quitCom = (): Promise<void> => {
    return execComUtil(`docker-compose --file ${dockerComposePath} down -v`)
    .then((result: string | undefined) => {
        console.log(result);
        console.log("Delete Open API document browsing environment is complete.");
    })
    
}


(async () => {
    try {
        switch(action) {
            case "start":
                await startCom()
                break;
            case "open":
                await openCom();
                break;
            case "stop":
                await stopCom()
                break;
            case "quit":
                await quitCom()
                break;
            default:
                throw new Error(`[ERROR]Please specify following action as FIRST argument.\n\tstart\n\topen\n\tstop\n\tquit`);
        }
    } catch(e) {
        throw e
    }

    exit();
})()
