import { useEffect, useState, useRef } from "react";
import outOkAudio from "../assets/out_ok.mp3";
import inOkAudio from "../assets/in_ok.mp3";
import repeatedAudio from "../assets/repeated.mp3";
import retryAudio from "../assets/retry.mp3";
import "weui";
import {
  Form,
  FormCell,
  CellBody,
  CellFooter,
  Switch,
  Button,
  ButtonArea,
} from "react-weui";
import "react-weui/build/packages/react-weui.css";

function ScanPage() {
  const [mode, setMode] = useState("in"); // in, out
  const [scanRes, setScanRes] = useState<{ resultStr: string }>({
    resultStr: "",
  });
  const [authState, setAuthState] = useState<{
    authenticated: boolean;
    user: { nickname: string; headimgurl: string } | null;
  }>({ authenticated: false, user: null });
  const refAudioInOk = useRef<HTMLAudioElement>(null);
  const refAudioOutOk = useRef<HTMLAudioElement>(null);
  const refAudioRepeated = useRef<HTMLAudioElement>(null);
  const refAudioRetry = useRef<HTMLAudioElement>(null);

  const scanQRCode = () => {
    wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: [/*"qrCode",*/ "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res: any) {
        console.log("xxx", res);
        setScanRes(res);
        if (res?.errMsg === "scanQRCode:ok") {
          if (res.resultStr.split(",")[0] !== "CODE_128") {
            refAudioRetry?.current?.play();
          } else {
            // fetch(`/api/in?orderId=${res.resultStr}&mode=${mode}`)
            window.app
              .callContainer({
                config: {
                  env: "prod-1goss70m27b551ae",
                },
                path: "/api/in",
                header: {
                  "X-WX-SERVICE": "moyang",
                  "content-type": "application/json",
                },
                method: "POST",
                data: JSON.stringify({
                  orderId: res.resultStr.split(",")[1],
                }),
              })
              .then((res) => res.json())
              .then((res) => {
                console.log("resp ==== ", res);
                if (res.errcode === "ok") {
                  if (mode === "in") {
                    refAudioInOk.current?.play();
                    // const utterance = new SpeechSynthesisUtterance(
                    //   "123 Apple Inc."
                    // );
                    // speechSynthesis.speak(utterance);
                  } else {
                    refAudioOutOk.current?.play();
                  }
                }
                if (res.errcode === "repeated") {
                  refAudioRepeated.current?.play();
                }
              });
          }

          if (autoMode === true) {
            setTimeout(scanQRCode, 700);
          }
        }
      },
      fail: function (e: any) {
        console.log("eee", e);
      },
    });
  };

  const apiMe = async () => {
    window.app
      .callContainer({
        config: {
          env: "prod-1goss70m27b551ae",
        },
        path: "/api/me",
        header: {
          "X-WX-SERVICE": "moyang",
          "content-type": "application/json",
        },
        method: "GET",
      })
      .then(({ data }) => {
        console.log("/api/me.data", data);
        setAuthState(data);
      });
    // fetch("/api/me").then(async (res) => {
    //   const respJson = await res.json();
    //   console.log("api/me.resp", respJson);
    //   setAuthState(respJson);
    // });
  };
  useEffect(() => {
    apiMe();
  }, []);

  const [autoMode, setAutoMode] = useState(false);

  return (
    <div className="scan-container">
      {authState?.authenticated === true && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <a href="#" target="_blank">
            <img
              style={{ padding: 0 }}
              src={authState?.user?.headimgurl}
              className="logo"
              alt="Vite logo"
            />
          </a>
          <h3>Hello, {authState?.user?.nickname}</h3>
        </div>
      )}
      {authState?.authenticated === true && (
        <Form>
          <FormCell switch>
            <CellBody>入库 / 出库</CellBody>
            <CellFooter>
              <Switch
                checked={mode === "in"}
                onChange={(e: any) => {
                  if (e.target.checked) {
                    setMode("in");
                  } else {
                    setMode("out");
                  }
                }}
              />
            </CellFooter>
          </FormCell>

          <FormCell switch>
            <CellBody>连扫模式</CellBody>
            <CellFooter>
              <Switch
                checked={autoMode}
                onChange={(e: any) => {
                  if (e.target.checked) {
                    setAutoMode(true);
                  } else {
                    setAutoMode(false);
                  }
                }}
              />
            </CellFooter>
          </FormCell>
        </Form>
      )}
      <div style={{ padding: 0, margin: 0 }}>
        {(!authState || !authState.authenticated) && (
          <ButtonArea>
            <Button
              style={{ margin: 0, padding: 0 }}
              onClick={() => {
                const redirectUri =
                  "http%3A%2F%2F192.168.61.198%3A5173%2Fapi%2Fweixin-login-cb";
                const userinfoUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
                  import.meta.env.VITE_APP_ID
                }&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=123133#wechat_redirect`;
                window.location.href = userinfoUrl;
              }}
            >
              登陆
            </Button>
          </ButtonArea>
        )}
        {authState?.authenticated && (
          <>
            <h3 style={{ textAlign: "center", marginTop: "4px" }}>
              {scanRes?.resultStr?.split(",")?.[1]}
            </h3>
          </>
        )}

        {/* <p>welcome to use 小暮陽</p> */}
        {authState?.authenticated && (
          <ButtonArea>
            <Button
              //button to display toptips
              onClick={scanQRCode}
            >
              开始扫件
            </Button>
          </ButtonArea>
        )}
        <audio src={outOkAudio} ref={refAudioOutOk} autoPlay={false} />
        <audio src={inOkAudio} ref={refAudioInOk} />
        <audio src={repeatedAudio} ref={refAudioRepeated} />
        <audio src={retryAudio} ref={refAudioRetry} />
        {/* <wx-open-subscribe
          template="-oEA4rcjVdStJSTQRatoq9H1xutyAJY0GLDhc6Iiom8"
          id="subscribe-btn"
          ref={sub}
        >
          <script type="text/wxtag-template">
            <button className="subscribe-btn">一次性模版消息订阅</button>
          </script>
          <script type="text/wxtag-template">
            <button>播放</button>
          </script>
        </wx-open-subscribe> */}
      </div>
    </div>
  );
}

export default ScanPage;
