const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, Order } = require("./db");

const logger = morgan("tiny");

const app = express();
app.use(express.static("dist"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

console.log("process.env", process.env);

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/scan", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/me", async (req, res) => {
  console.log("headers", req.headers);
  const resp = await fetch(
    `http://api.weixin.qq.com/cgi-bin/user/info?openid=${req.headers["x-wx-openid"]}&lang=LANG`,
    {
      method: "POST",
    }
  );
  const respJson = await resp.json();
  res.send({
    authenticated: true,
    user: respJson,
  });
});

// 更新计数
app.post("/api/in", async (req, res) => {
  const userId = req.headers["x-userid"];
  const orderId = req.body?.orderId;
  console.log("orderid = ", orderId);
  if (!orderId) {
    res.send({ errcode: 1, errmsg: "order id wrong" });
  }
  try {
    await Order.create({ order_id: orderId, created_by_user_id: userId });
    res.send({
      errcode: "ok",
    });
  } catch (e) {
    console.log("insert error", e);
  }
});

app.get("/api/orders", async (req, res) => {
  const userId = req.headers["x-userid"];
  if (userId !== "oxnqE6SuQgVKtePpTy-wAhTu9Am4") {
    res.send({ errcode: 10 });
    return;
  }
  const data = Order.findAll();
  res.send({
    errcode: "ok",
    data,
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  console.log("req.header", req.headers);
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

const port = process.env.PORT || 80;

async function bootstrap() {
  try {
    await initDB();
  } catch (e) {
    console.error(e);
  }
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
