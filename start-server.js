let http = require('http');
let fs = require('fs');
const querystring = require('querystring'); //for parsing query strings
let port = 3000; //replace the number with the port number assigned to you


http.createServer(function (req, res) {
    let now = new Date();
    console.log(req.method + ": " + req.url)

    //handle get request
    if (req.method === "GET") {
        handleGetRequest(req, res);
    } else if (req.method === "POST") {
        handlePostRequest(req, res);
    }

}).listen(port);

console.log(`Server running at port ${port}...\nPress CTRL+C to stop.`);

function handleGetRequest(req, res) {
    fs.stat(`.${req.url}`, function (err, stat) {

        if (err == null) {
            if (req.url === '/') {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
                fs.createReadStream('indexHome.html', 'UTF-8').pipe(res);
                return
            }

            if (req.url.endsWith('.css')) {
                res.writeHead(200, { 'Content-Type': 'text/css; charset=UTF-8' });
            } else if (req.url.endsWith('.html')) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
            } else if (req.url.endsWith('.js')) {
                res.writeHead(200, { 'Content-Type': 'application/javascript; charset=UTF-8' });
            }

            fs.createReadStream(`.${req.url}`, "UTF-8").pipe(res);

        } else if (err.code === 'ENOENT') {
            response404(res);

        } else {
            console.log('unknown error');
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
            res.end("unkown error!");
        }
    });
}

function handlePostRequest(req, res) {
    if (req.url !== "/submitData") {
        response404(res);
    } else {
        let requestBody = '';
        req.on("data", function (data) {
            requestBody += data;
        });

        req.on("end", function () {
            console.log(`requestBody: ${requestBody}\n`);
            let formData = querystring.parse(requestBody);

            console.log('formData:');
            console.log(formData);

            writeToCsv(formData);

        })

        sendSuccessResponse(res);

    }
}

function writeToCsv(formData) {
    let dataString = `${formData.name},${formData.number},${formData.email},${formData.role},${formData.comments},${formData.shower},${formData.flushes},${formData.brush},${formData.wash},${formData.savingtoilets},${formData.showerheads},${formData.dishwasher}\n`;
    fs.appendFileSync('Data/responses.csv', dataString);
}

function sendSuccessResponse(res) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    fs.createReadStream(`./form-submittedTatiana.html`, "UTF-8").pipe(res);
}

function response404(res) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end("File not found!");
}