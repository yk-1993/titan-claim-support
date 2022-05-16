import axios from "axios";
import { useCallback, useState } from "react";

export const UseGetBalance = (props) => {
  const [titaBalance, setTitaBalance] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  // 残高を取得するアドレスを指定（ここではTitan huntersのコントラクトアドレス）
  const address = "0xa3B07537fCA84a941E69dD11d73640284082F6b1";
  // 取得するトークンのアドレスを指定（TITA）
  const contractAddress = "0x0c1253a30da9580472064a91946c5ce0C58aCf7f";
  // 自身のBSCScan apiKeyを設定
  const apiKey = props.key;
  const getBalance = useCallback(() => {
    axios
      .get(
        `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${apiKey}`
      )
      .then((res) => {
        if (res.data) {
          const balance = res.data.result / 1e18;
          console.log("balance: " + balance + " TITA");
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
      });
  }, []);
  return { getBalance, titaBalance, isSuccess };
};
