import React, { useState, useEffect } from "react";
import { UseGetBalance } from "./UseGetBalance.js";
import { UseGetTransaction } from "./UseGetTransaction";
import useSound from "use-sound";
import Sound from "../se/alert.mp3";
import Cookies from "js-cookie";
import styled from "styled-components";

export function Bsc() {
  // apikeyをcookieから取得して返すメソッド
  const getInputApiKey = () => {
    const cookieApiKey = Cookies.get("apiKey");
    if (cookieApiKey === "null" || cookieApiKey === undefined) {
      //apikeyがcookieから取得できなかった場合、入力を求める
      const inputApiKey = prompt("APIKEYを入力してください");
      //入力値をcookieに設定
      Cookies.set("apiKey", inputApiKey);
      return inputApiKey;
    } else {
      return cookieApiKey;
    }
  };
  const [play] = useSound(Sound);
  //apikeyをpropsで渡す
  const { getBalance, titaBalance, isSuccess } = UseGetBalance({
    key: getInputApiKey(),
  });
  //apikeyをpropsで渡す
  const { txTime, isSuccessT, getTransaction, txState } = UseGetTransaction({
    key: Cookies.get("apiKey"),
  });
  //内部時刻の状態定義
  const [time, setTime] = useState(new Date());
  //画面表示時刻の状態定義
  const [displayTime, setDisplayTime] = useState(new Date());
  //残高取得履歴の状態定義
  const [timeHistory, setTimeHistory] = useState<histosy[]>([]);
  //履歴のインターフェース
  type histosy = {
    time: string;
    titaBalance: number;
  };
  // 画面表示時刻[displayTime]が更新されるごとに実行される
  // BSCScan apiで残高を取得後、画面に更新。残高が4000以上の場合、かつ前回の音通知から30秒以上経過している場合、音通知を行う
  useEffect(() => {
    getBalance();
    getTransaction();
    // 現在時刻を取得
    const nowDate = new Date();
    // 現在時刻から、最新１件のトランザクション時刻を引く
    const txDiffTime = nowDate.getTime() - txTime.getTime();
    // TITA残高の時差
    const diff = new Date().getTime() - time.getTime();
    // ミリ秒を返還
    const fixDiff = diff / 1000;
    console.log("timeDiff:" + fixDiff);
    console.log("txDiffTimeSecond: " + txDiffTime / 1000);
    // 時刻とＴＸ時刻の差をミリ秒にし、30秒より小さい場合
    if (txDiffTime / 1000 < 5 && isSuccessT) {
      console.log("txDiffTimeSecond: " + txDiffTime / 1000);
      // 音通知
      play();
      setTimeSecond();
    }
    // 残高4000以上
    if (titaBalance > 4000) {
      // 時間差30秒
      if (fixDiff > 30) {
        // 音通知
        play();
        console.log("setTime: " + time);
        // 現在の時刻を設定
        setTimeSecond();
      }
      console.log(time);
    }
  }, [displayTime]);
  // 画面表示時刻を1秒刻みで更新
  useEffect(() => {
    setInterval(() => {
      setDisplayTime(new Date());
    }, 1000);
  }, []);
  // TITA残高に更新があった場合、時刻と残高を取得し、残高取得履歴に追加
  useEffect(() => {
    if (titaBalance) {
      timeHistory.push({
        time: displayTime.toLocaleString({ locales: "Asia/Tokyo" }),
        titaBalance: titaBalance,
      });
    }
  }, [titaBalance]);
  // 現在の時刻を設定（時間差を測定する為）
  const setTimeSecond = () => {
    const now_date = new Date();
    setTime(now_date);
  };
  // 残高取得履歴ボタン押下時、時刻と残高を取得し、残高取得履歴に追加
  const setHistory = () => {
    if (titaBalance) {
      timeHistory.push({
        time: displayTime.toLocaleString({ locales: "Asia/Tokyo" }),
        titaBalance: titaBalance,
      });
    }
    console.log(timeHistory);
  };
  // 初期処理で残高取得履歴を削除
  useEffect(() => {
    deleteHistory();
  }, []);
  const deleteHistory = () => {
    setTimeHistory([]);
  };
  //API Cookie削除ボタン押下後、Cookieを削除し画面リロード
  const reLoad = () => {
    Cookies.remove("apiKey");
    window.location.reload();
  };
  const onSound = () => {
    play();
    // 30秒前に設定
    const subtraction_time = 30 * 1000;
    const now_date = new Date();
    setTime(new Date(now_date.getTime() - subtraction_time));
  };
  return (
    <div>
      <header>
        Titan Hunters Claim Support Tool v0.2 by{" "}
        <a href="https://twitter.com/aoooojpn" target="_blank">
          @aoooojpn
        </a>
      </header>
      <h1>{displayTime.toLocaleTimeString()}</h1>
      <h2>{`CONTRACT TITA BALANCE: ${titaBalance} TITA`}</h2>
      <h2>【最終プール情報▼】</h2>
      <h4>{`LAST POOL Tx TIME: ${txTime.toLocaleDateString()} ${txTime.toLocaleTimeString()}`}</h4>
      <h4>{`LAST POOL POOL BALANCE: ${txState}`}</h4>
      <BaseButton
        onClick={() => {
          onSound();
        }}
      >
        SOUND通知許可
      </BaseButton>
      <span>
        ※4000TITA以上の場合･トランザクション生成５秒以内の場合に通知 / 30秒
      </span>

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
        API Cookie 削除
      </BaseButton>
      <Text1>
        <p>
          06/22機能追加
          <br />
          APIのアクセス過多でTITA残高がリアルタイムで取得できていないことが最近多いので、
          <br />
          送金元のアドレスから送金トランザクションの情報も取得するように修正(試験導入)。
          <br />
          2回目以降のアドレスに送金されるTxのみ取得します。
        </p>
        <p>
          TITA残高ではなくトランザクションの情報を見るようしてみてください。
        </p>
        <p>LAST POOL Tx TIME(最後のPOOLトランザクション生成時間)</p>
        <p>POOL BALANCE（最後のPOOLで送金されるTITA量）</p>
      </Text1>
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
const Text1 = styled.div`
  text-align: left;
  width: 70%;
  margin: auto;
  font-size: 14px;
`;
