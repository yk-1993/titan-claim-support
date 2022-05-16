import axios from "axios";
import { useCallback, useState } from "react";

export const UseGetBalance = (props) => {
  const [titaBalance, setTitaBalance] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  // 残高を取得するアドレスを指定（ここではTitan huntersのコントラクトアドレス）
  const address = "0xa3B07537fCA84a941E69dD11d73640284082F6b1";
  // 取得するトークンのアドレスを指定（ここではTITAのトークンアドレス）
  const contractAddress = "0x0c1253a30da9580472064a91946c5ce0C58aCf7f";
  // 自身のBSCScan apiKeyを設定
  // propsから渡されてくる文字列（ユーザーの入力値）
  const apiKey = props.key;
  const getBalance = useCallback(() => {
    axios
      .get(
        `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${apiKey}`
      )
      .then((res) => {
        if (res.data) {
          // 取得した残高はe18でパンプされているようなので、e18で割っておく
          const balance = res.data.result / 1e18;
          // 取得した残高をコンソール表示
          console.log("balance: " + balance + " TITA");
          // 残高を状態変数に設定
          setTitaBalance(balance);
          if (res.data.message === "OK") {
            setIsSuccess(true);
          } else {
            setIsSuccess(false);
          }
        }
      })
      .catch(() => {
        console.log("ERROR.");
        setIsSuccess(false);
      });
  }, []);
  return { getBalance, titaBalance, isSuccess };
};
