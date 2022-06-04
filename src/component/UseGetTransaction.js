import axios from "axios";
import { useCallback, useState } from "react";

export const UseGetTransaction = (props) => {
  const [isSuccessT, setIsSuccessT] = useState(false);
  const [txTime, setTxTime] = useState(new Date());
  const [txState, setTxState] = useState("");
  // 取得するトークンのアドレスを指定（ここではTITAのトークンアドレス）
  const contractAddress = "0x0c1253a30da9580472064a91946c5ce0C58aCf7f";
  // 取得するトランザクションのアドレスを指定（プール送金元アドレス）
  const transactionAddress = "0x090de8bba37096bc52788ac23586a47a90165daa";
  // 自身のBSCScan apiKeyを設定
  // propsから渡されてくる文字列（ユーザーの入力値）
  const apiKey = props.key;
  const getTransaction = useCallback(() => {
    axios
      .get(
        `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${transactionAddress}&page=1&offset=1&startblock=0&endblock=999999999&sort=desc&apikey=${apiKey}`
      )
      .then((res) => {
        if (res.data) {
          if (res.data.message === "OK") {
            setTxTime(new Date(res.data.result[0].timeStamp * 1000));
            setTxState(res.data.result[0].confirmations);
            // 残高を状態変数に設定
            setIsSuccessT(true);
          } else {
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
