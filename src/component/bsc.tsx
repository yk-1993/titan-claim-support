import React, { useState, useEffect } from "react";
import { UseGetBalance } from "./UseGetBalance.js";
import useSound from "use-sound";
import Sound from "../se/alert.mp3";
import Cookies from "js-cookie";
import styled from "styled-components";

export function Bsc() {
  const getInputApiKey = () => {
    const cookieApiKey = Cookies.get("apiKey");
    if (cookieApiKey === "null" || cookieApiKey === undefined) {
      const inputApiKey = prompt("BSCのAPIKEYを入力してください");
      Cookies.set("apiKey", inputApiKey);
      setApiKey(inputApiKey);
      return inputApiKey;
    } else {
      return cookieApiKey;
    }
  };
  const [apiKey, setApiKey] = useState("");
  const [play, { stop, pause }] = useSound(Sound);
  const { getBalance, titaBalance, isSuccess } = UseGetBalance({
    key: getInputApiKey(),
  });
  const [time, setTime] = useState(new Date());
  const [displayTime, setDisplayTime] = useState(new Date());
  const [timeHistory, setTimeHistory] = useState<histosy[]>([]);
  type histosy = {
    time: string;
    titaBalance: number;
  };

  useEffect(() => {
    getBalance();
    const diff = new Date().getTime() - time.getTime();
    const fixDiff = diff / 1000;
    console.log("timeDiff:" + fixDiff);
    if (titaBalance > 4000) {
      if (fixDiff > 30) {
        play();
        console.log("setTime: " + time);
        setTimeSecond();
      }
      console.log(time);
    }
  }, [displayTime]);

  useEffect(() => {
    setInterval(() => {
      setDisplayTime(new Date());
    }, 1000);
  }, []);
  useEffect(() => {
    if (titaBalance) {
      timeHistory.push({
        time: displayTime.toLocaleString({ locales: "Asia/Tokyo" }),
        titaBalance: titaBalance,
      });
    }
  }, [titaBalance]);
  const setTimeSecond = () => {
    const now_date = new Date();
    setTime(now_date);
  };
  const setHistory = () => {
    if (titaBalance) {
      timeHistory.push({
        time: displayTime.toLocaleString({ locales: "Asia/Tokyo" }),
        titaBalance: titaBalance,
      });
    }
    console.log(timeHistory);
  };

  useEffect(() => {
    deleteHistory();
  }, []);
  const deleteHistory = () => {
    setTimeHistory([]);
  };
  const reLoad = () => {
    Cookies.remove("apiKey");
    window.location.reload();
  };
  return (
    <div>
      <header>
        Titan Hunters Claim Support Tool v0.1 by{" "}
        <a href="https://twitter.com/aoooojpn" target="_blank">
          @aoooojpn
        </a>
      </header>
      <h1>{displayTime.toLocaleTimeString()}</h1>
      <h3>{`CONTRACT TITA BALANCE: ${titaBalance} TITA`}</h3>
      <BaseButton
        onClick={() => {
          play();
        }}
      >
        SOUND通知許可
      </BaseButton>
      <span>※4000TITA以上の場合に通知 / 30秒</span>

      <BaseButton
        onClick={() => {
          deleteHistory();
        }}
      >
        残高取得履歴削除
      </BaseButton>
      <HistoryBox>
        <h4>残高取得履歴</h4>
        {timeHistory
          .map((history) => (
            <p>
              取得時間：{history.time} / TITA残高：{history.titaBalance}
            </p>
          ))
          .reverse()}
      </HistoryBox>

      <BaseButton
        onClick={() => {
          setHistory();
        }}
      >
        現在時刻と現在TITA残高を履歴に追加
      </BaseButton>
      <p>
        {isSuccess
          ? "API STATUS:成功"
          : "API STATUS:失敗 (API Cookie削除後、BSC ScanのAPIKEYを再度入力してください)"}
      </p>
      <BaseButton
        onClick={() => {
          reLoad();
        }}
      >
        API Cookie削除
      </BaseButton>
    </div>
  );
}
export default Bsc;

const BaseButton = styled.button`
  background: #db1919;
  border-radius: 3px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
  max-width: 220px;
  padding: 5px 25px;
  color: #fff;
  transition: 0.2s ease-in-out;
  font-weight: 600;
  box-shadow: 5px 5px 0 #f1e102;

  &:hover {
    background-color: #f1e102;
    color: #db1919;
    box-shadow: 0 0 0;
    transform: translate(5px, 5px);
    cursor: pointer;
  }
`;
const HistoryBox = styled.div`
  border: 1px solid #ccc;
  margin: 20px auto;
  border-radius: 20px;
  width: 90%;
`;
