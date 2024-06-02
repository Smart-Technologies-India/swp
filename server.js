const path = require("path");
const axios = require("axios");

const { createRequestHandler } = require("@remix-run/express");
const { installGlobals } = require("@remix-run/node");
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const crypto = require("crypto");
const qs = require("querystring");

function getAlgorithm(keyBase64) {
  var key = Buffer.from(keyBase64, "base64");
  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 32:
      return "aes-256-cbc";
  }
  throw new Error("Invalid key length: " + key.length);
}

// payment utils start here

const encrypt = (plainText, keyBase64, ivBase64) => {
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");

  const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (messagebase64, keyBase64, ivBase64) => {
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");

  const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);
  let decrypted = decipher.update(messagebase64, "hex");
  decrypted += decipher.final();
  return decrypted;
};

const postRes = (request, response) => {
  // const prisma = new PrismaClient();

  var ccavEncResponse = "",
    ccavResponse = "",
    workingKey = "A37AF19500BBE270975D7A28D555A586", //Put in the 32-Bit key shared by CCAvenues.
    ccavPOST = "";

  //Generate Md5 hash for the key and then convert in base64 string
  var md5 = crypto.createHash("md5").update(workingKey).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");

  //Initializing Vector and then convert in base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");

  request.on("data", function (data) {
    ccavEncResponse += data;
    ccavPOST = qs.parse(ccavEncResponse);
    var encryption = ccavPOST.encResp;
    ccavResponse = decrypt(encryption, keyBase64, ivBase64);
  });

  request.on("end", async function () {
    const keysToKeep = [
      "order_id",
      "tracking_id",
      "bank_ref_no",
      "order_status",
      "payment_mode",
      "card_name",
      "amount",
      "billing_name",
      "merchant_param1",
    ];

    const pairs = ccavResponse.split("&");
    const result = {};
    pairs.forEach((pair) => {
      const [key, value] = pair.split("=");

      if (keysToKeep.includes(key)) {
        result[key] = value === "null" ? null : decodeURIComponent(value);
      }
    });

    if (result.order_status == "Aborted") {
      const htmlcode = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Abort</title><script src="https://cdn.tailwindcss.com"></script></head><body><main class="h-screen w-full bg-[#eeeeee] grid place-items-center"><div class="w-96 bg-white rounded-lg p-6"><h1 class="text-rose-500 text-4xl text-center font-semibold">Abort</h1><div class="h-[1px] bg-gray-400 w-full mt-2"></div><p class="text-xl text-slate-700 text-center font-medium mt-4">Payment declined by client.</p><div class="flex item-center gap-6 mt-4"><a href="https://s2.dddgov.in/" class="grow py-1 text-center rounded-lg bg-blue-500 text-2xl text-white flex items-center gap-2 justify-center cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M4 21v-9.375L2.2 13L1 11.4L12 3l11 8.4l-1.2 1.575l-1.8-1.35V21zm4-6q-.425 0-.712-.288T7 14q0-.425.288-.712T8 13q.425 0 .713.288T9 14q0 .425-.288.713T8 15m4 0q-.425 0-.712-.288T11 14q0-.425.288-.712T12 13q.425 0 .713.288T13 14q0 .425-.288.713T12 15m4 0q-.425 0-.712-.288T15 14q0-.425.288-.712T16 13q.425 0 .713.288T17 14q0 .425-.288.713T16 15"/></svg><p>Home</p></a><a href="https://s2.dddgov.in/contact_about" class="grow py-1 text-center rounded-lg bg-rose-500 text-2xl text-white flex items-center gap-2 justify-center cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M19 11.95q0-2.925-2.037-4.962T12 4.95v-2q1.875 0 3.513.713t2.85 1.925q1.212 1.212 1.925 2.85T21 11.95zm-4 0q0-1.25-.875-2.125T12 8.95v-2q2.075 0 3.538 1.463T17 11.95zM19.95 21q-3.125 0-6.175-1.362t-5.55-3.863q-2.5-2.5-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238t.325.562l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.925 1.187 1.787t1.513 1.663q.775.775 1.625 1.438T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.1.575.363T21 15.9v4.05q0 .45-.3.75t-.75.3"/></svg><p>Contact</p></a></div></div></main></body></html>`;
      response.writeHeader(200, { "Content-Type": "text/html" });
      response.write(htmlcode);
      response.end();
    } else if (result.order_status == "Success") {
      const paymentid = result.merchant_param1.toString().split("_")[0];
      const userid = result.merchant_param1.toString().split("_")[1];
      const formid = result.merchant_param1.toString().split("_")[2];
      const type = result.merchant_param1.toString().split("_")[3];
      const formstatus = result.merchant_param1.toString().split("_")[4];

      const res1 = await axios.post("https://apis2.dddgov.in/graphql", {
        query: `mutation updatePaymentById($updatePaymentInput:UpdatePaymentInput!){
            updatePaymentById(updatePaymentInput:$updatePaymentInput){
              id,
            }
          }`,
        variables: {
          updatePaymentInput: {
            id: Number(paymentid),
            paymentstatus: "PAID",
            bankreference: result.bank_ref_no,
            paymentType: result.payment_mode,
            orderid: result.order_id,
            transactionid: result.tracking_id,
          },
        },
      });

      console.log(res1.data);

      const req = {
        stage: type,
        form_id: formid,
        from_user_id: Number(userid),
        to_user_id: 51,
        form_status: formstatus,
        query_type: "PUBLIC",
        remark: `The payment of Rs. (${result.amount}) requested from user is successfully paid vide ${result.payment_mode} with reference no ${result.bank_ref_no}.`,
        query_status: "SENT",
        status: "NONE",
      };

      const res2 = await axios.post("https://apis2.dddgov.in/graphql", {
        query: `mutation createQuery($createQueryInput:CreateQueryInput!){
            createQuery(createQueryInput:$createQueryInput){
              id,
            }
          }`,
        variables: {
          createQueryInput: req,
        },
      });

      console.log(res2.data);

      const htmlcode = `<html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Success</title>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            min-height: 100vh;
            background-color: #eee;
            display: grid;
            place-items: center;
          }
          main {
            width: 400px;
            background-color: #fff;
            border-radius: 20px;
            padding: 20px;
          }
          .title {
            text-align: center;
            color: #22c55e;
            font-size: 30px;
            font-family: "Roboto", sans-serif;
          }
          .subtitle {
            text-align: center;
            color: #333;
            font-size: 18px;
            font-family: "Roboto", sans-serif;
            background: linear-gradient(to left, #bfdbfe, #fed7aa);
            border-radius: 5px;
            padding: 4px 0;
            margin-top: 20px;
            font-weight: 500;
          }
          #date {
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
            font-family: "Roboto", sans-serif;
            margin-top: 20px;
          }
          .header {
            font-family: "Roboto", sans-serif;
            background: linear-gradient(to left, #bfdbfe, #fed7aa);
            text-align: center;
            padding: 10px;
            border-top-right-radius: 10px;
            border-top-left-radius: 10px;
            margin-top: 20px;
          }
          .header .price {
            font-weight: 700;
            font-size: 24px;
          }
          .paymentdetails {
            border: 1px solid #eee;
            padding: 10px;
          }
          .paymentdetails .main {
            display: flex;
            justify-content: space-between;
            margin: 6px 0px;
          }
          .paymentdetails .main .prop {
            font-weight: 400;
            color: #9ca3af;
            font-size: 14px;
            font-family: "Roboto", sans-serif;
          }
          .paymentdetails .main .value {
            color: #333;
            font-size: 14px;
            font-family: "Roboto", sans-serif;
            font-weight: 400;
          }
          .btnbox {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }
          .btnone {
            display: flex;
            align-items: center;
            padding: 4px 20px;
            background-color: #3b82f6;
            border-radius: 5px;
            color: #fff;
            text-decoration: none;
            font-size: 20px;
            font-family: "Roboto", sans-serif;
            font-weight: 500;
          }
          .btntwo {
            display: flex;
            align-items: center;
            padding: 4px 20px;
            background-color: #f43f5e;
            border-radius: 5px;
            color: #fff;
            text-decoration: none;
            font-size: 20px;
            font-family: "Roboto", sans-serif;
            font-weight: 500;
          }
          .btnone svg,
          .btntwo svg {
            margin-right: 10px;
            transform: scale(0.8);
          }
        </style>
      </head>
    
      <body>
        <main>
          <h1 class="title">Transaction Successful</h1>
    
          <p class="subtitle">Transaction ID : ${result.tracking_id}</p>
          <p id="date"></p>
          <div class="header">
            <p>Total Amount Transfered</p>
            <p class="price">₹ ${result.amount}</p>
          </div>
          <div class="paymentdetails">
            <div class="main">
              <div class="prop">Order ID</div>
              <div class="value">${result.order_id}</div>
            </div>
            <div class="main">
              <div class="prop">Paid For</div>
              <div class="value">${result.billing_name}</div>
            </div>
            <div class="main">
              <div class="prop">Bank Ref Number</div>
              <div class="value">${result.bank_ref_no}</div>
            </div>
            <div class="main">
              <div class="prop">Payee Name</div>
              <div class="value">${result.billing_name}</div>
            </div>
            <div class="main">
              <div class="prop">To</div>
              <div class="value">PDA, DNH</div>
            </div>
            <div class="main">
              <div class="prop">Payment Type</div>
              <div class="value">${result.payment_mode}</div>
            </div>
          </div>
    
          <div class="btnbox">
            <a href="https://s2.dddgov.in/" class="btnone" target="_self">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M4 21v-9.375L2.2 13L1 11.4L12 3l11 8.4l-1.2 1.575l-1.8-1.35V21zm4-6q-.425 0-.712-.288T7 14q0-.425.288-.712T8 13q.425 0 .713.288T9 14q0 .425-.288.713T8 15m4 0q-.425 0-.712-.288T11 14q0-.425.288-.712T12 13q.425 0 .713.288T13 14q0 .425-.288.713T12 15m4 0q-.425 0-.712-.288T15 14q0-.425.288-.712T16 13q.425 0 .713.288T17 14q0 .425-.288.713T16 15"
                />
              </svg>
              <p>Home</p>
            </a>
            <a href="https://s2.dddgov.in/contact_about" class="btntwo" target="_self">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19 11.95q0-2.925-2.037-4.962T12 4.95v-2q1.875 0 3.513.713t2.85 1.925q1.212 1.212 1.925 2.85T21 11.95zm-4 0q0-1.25-.875-2.125T12 8.95v-2q2.075 0 3.538 1.463T17 11.95zM19.95 21q-3.125 0-6.175-1.362t-5.55-3.863q-2.5-2.5-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238t.325.562l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.925 1.187 1.787t1.513 1.663q.775.775 1.625 1.438T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.1.575.363T21 15.9v4.05q0 .45-.3.75t-.75.3"
                />
              </svg>
              <p>Contact</p>
            </a>
          </div>
        </main>
        <script>
          document.getElementById("date").innerHTML = new Date().toDateString();
        </script>
      </body>
    </html>
    `;

      response.writeHeader(200, { "Content-Type": "text/html" });
      response.write(htmlcode);
      response.end();
    } else {
      const htmlcode = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Failed</title><script src="https://cdn.tailwindcss.com"></script></head><body><main class="h-screen w-full bg-[#eeeeee] grid place-items-center"><div class="w-96 bg-white rounded-lg p-6"><h1 class="text-rose-500 text-4xl text-center font-semibold">Failed</h1><div class="h-[1px] bg-gray-400 w-full mt-2"></div><p class="text-xl text-slate-700 text-center font-medium mt-4">Payment Failed.</p><div class="flex item-center gap-6 mt-4"><a href="https://s2.dddgov.in/" class="grow py-1 text-center rounded-lg bg-blue-500 text-2xl text-white flex items-center gap-2 justify-center cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M4 21v-9.375L2.2 13L1 11.4L12 3l11 8.4l-1.2 1.575l-1.8-1.35V21zm4-6q-.425 0-.712-.288T7 14q0-.425.288-.712T8 13q.425 0 .713.288T9 14q0 .425-.288.713T8 15m4 0q-.425 0-.712-.288T11 14q0-.425.288-.712T12 13q.425 0 .713.288T13 14q0 .425-.288.713T12 15m4 0q-.425 0-.712-.288T15 14q0-.425.288-.712T16 13q.425 0 .713.288T17 14q0 .425-.288.713T16 15"/></svg><p>Home</p></a><a href="https://s2.dddgov.in/contact_about" class="grow py-1 text-center rounded-lg bg-rose-500 text-2xl text-white flex items-center gap-2 justify-center cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M19 11.95q0-2.925-2.037-4.962T12 4.95v-2q1.875 0 3.513.713t2.85 1.925q1.212 1.212 1.925 2.85T21 11.95zm-4 0q0-1.25-.875-2.125T12 8.95v-2q2.075 0 3.538 1.463T17 11.95zM19.95 21q-3.125 0-6.175-1.362t-5.55-3.863q-2.5-2.5-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238t.325.562l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.925 1.187 1.787t1.513 1.663q.775.775 1.625 1.438T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.1.575.363T21 15.9v4.05q0 .45-.3.75t-.75.3"/></svg><p>Contact</p></a></div></div></main></body></html>`;
      response.writeHeader(200, { "Content-Type": "text/html" });
      response.write(htmlcode);
      response.end();
    }
  });
};

const postReq = (request, response) => {
  var body = "",
    workingKey = "A37AF19500BBE270975D7A28D555A586", //Put in the 32-Bit key shared by CCAvenues.
    accessCode = "AVSG05LE75CJ87GSJC", //Put in the Access Code shared by CCAvenues.
    encRequest = "",
    formbody = "";

  //Generate Md5 hash for the key and then convert in base64 string
  var md5 = crypto.createHash("md5").update(workingKey).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");

  //Initializing Vector and then convert in base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");

  request.on("data", function (data) {
    body += data;
    encRequest = encrypt(body, keyBase64, ivBase64);
    formbody =
      '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' +
      encRequest +
      '"><input type="hidden" name="access_code" id="access_code" value="' +
      accessCode +
      '"><script language="javascript">document.redirect.submit();</script></form>';
  });

  request.on("end", function () {
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write(formbody);
    response.end();
  });
  return;
};

// payment utils end here

installGlobals();

const BUILD_DIR = path.join(process.cwd(), "build");

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use(morgan("tiny"));

app.get("/payamount", async function (request, response) {
  response.writeHeader(200, { "Content-Type": "text/html" });
  // response.write(
  //   `<html><head><style>@import url(https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap);body{font-family:Roboto,sans-serif}</style></head><body><div style="width:100%;height:100vh;background-color:#eee;display:grid;place-items:center"><h1>LOADING...</h1></div><form method="POST" name="customerData" action="/ccavRequestHandler"><table width="40%" height="100" align="center"><input type="hidden" name="merchant_id" id="merchant_id" value="${3428043}"> <input type="hidden" name="billing_country" value="India"> <input type="hidden" name="billing_state" value="DN"> <input type="hidden" name="cancel_url" value="https://pdadnhrent.com/ccavResponseHandler"> <input type="hidden" name="redirect_url" value="https://pdadnhrent.com/ccavResponseHandler"> <input type="hidden" name="language" id="language" value="EN"> <input type="hidden" name="billing_zip" value="396220"> <input type="hidden" name="order_id" value="" id="order_id"> <input type="hidden" name="currency" value="INR"> <input type="hidden" name="amount" value="" id="amount"> <input type="hidden" name="merchant_param1" value="" id="purpose"><tr style="visibility:hidden"><td></td><td><input type="submit" value="Checkout" id="submit"></td></tr></table></form></body></html>`
  // );
  response.write(
    `<html><head><style>@import url(https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap);body{font-family:Roboto,sans-serif}</style></head><body><div style="width:100%;height:100vh;background-color:#eee;display:grid;place-items:center"><h1>LOADING...</h1></div><form method="POST" name="customerData" action="/ccavRequestHandler"><table width="40%" height="100" align="center"><input type="hidden" name="merchant_id" id="merchant_id" value="${3428043}"> <input type="hidden" name="billing_country" value="India"> <input type="hidden" name="billing_state" value="DN"> <input type="hidden" name="cancel_url" value="https://s2.dddgov.in/ccavResponseHandler"> <input type="hidden" name="redirect_url" value="https://s2.dddgov.in/ccavResponseHandler"> <input type="hidden" name="language" id="language" value="EN"> <input type="hidden" name="billing_zip" value="396220"> <input type="hidden" name="order_id" value="" id="order_id"> <input type="hidden" name="currency" value="INR"> <input type="hidden" name="amount" value="" id="amount"> <input type="hidden" name="merchant_param1" value="" id="purpose"><tr style="visibility:hidden"><td></td><td><input type="submit" value="Checkout" id="submit"></td></tr></table></form><script>const init = async () => { var url_string = window.location.href; var url = new URL(url_string); var amount = url.searchParams.get("xlmnx"); var id = url.searchParams.get("ynboy"); var purpose = url.searchParams.get("zgvfz"); document.getElementById("order_id").value = id; document.getElementById("amount").value = amount; document.getElementById("purpose").value = purpose; setTimeout(function () { document.getElementById("submit").click();}, 500); };window.addEventListener("load", init);</script></body></html>`
  );
  response.end();
});

app.post("/ccavRequestHandler", function (request, response) {
  postReq(request, response);
});

app.post("/ccavResponseHandler", function (request, response) {
  postRes(request, response);
});

app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? (req, res, next) => {
        purgeRequireCache();

        return createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
        })(req, res, next);
      }
    : createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
      })
);
const port = process.env.PORT || 5590;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
