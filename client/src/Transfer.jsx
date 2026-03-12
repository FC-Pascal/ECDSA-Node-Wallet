import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (!privateKey) {
      alert("Please enter a private key in the wallet first.");
      return;
    }

    const amount = parseInt(sendAmount);

    const message = JSON.stringify({ recipient, amount });
    const messageHash = keccak256(utf8ToBytes(message));

    // Updated to use the v1.2.0 syntax
    const [signature, recoveryBit] = await secp.sign(messageHash, privateKey, { recovered: true });

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount,
        recipient,
        signature: toHex(signature),
        recoveryBit,
        messageHash: toHex(messageHash)
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response?.data?.message || "An error occurred");
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;