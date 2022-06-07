import axios from "axios";
import { useCallback, useState } from "react";

export const UseGetTransaction = (props) => {
  const [isSuccessT, setIsSuccessT] = useState(false);
  const [txTime, setTxTime] = useState(new Date());
  const [txState, setTxState] = useState(0);
  // 取得するトークンのアドレスを指定（ここではTITAのトークンアドレス）
  const contractAddress = "0x0c1253a30da9580472064a91946c5ce0C58aCf7f";
  // 取得するトランザクションのアドレスを指定（プール送金元アドレス）
  const transactionAddress = "0x56157ab5efa086B3BDbF18ED01cA928A7c242087";
  // 残高を取得するアドレスを指定（ここではTitan huntersのコントラクトアドレス）
  const address = "0xa3b07537fca84a941e69dd11d73640284082f6b1";
  // 自身のBSCScan apiKeyを設定
  // propsから渡されてくる文字列（ユーザーの入力値）
  const apiKey = props.key;
  const getTransaction = useCallback(() => {
    axios
      .get(
        `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${transactionAddress}&page=1&offset=2&startblock=0&endblock=999999999&sort=desc&apikey=${apiKey}`
      )
      .then((res) => {
        if (res.data) {
          if (res.data.message === "OK") {
            // TITA送金先が２回目以降のクレームのアドレスの場合。
            if (res.data.result[0].to === address) {
              setTxTime(new Date(res.data.result[0].timeStamp * 1000));
              setTxState(res.data.result[0].value / 1e18);
              // 残高を状態変数に設定
              setIsSuccessT(true);
              return;
            }
            // TITA送金先が２回目以降のクレームのアドレスの場合。
            if (res.data.result[1].to === address) {
              setTxTime(new Date(res.data.result[1].timeStamp * 1000));
              // 残高を状態変数に設定
              setIsSuccessT(true);
              return;
            }
            setIsSuccessT(false);
          }
        }
      })
      .catch(() => {
        console.log("ERROR.");
        setIsSuccessT(false);
      });
  }, []);
  return { isSuccessT, txTime, txState, getTransaction };
};
