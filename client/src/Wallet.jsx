import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const inputVal = evt.target.value;
    setPrivateKey(inputVal); 
    
    if (inputVal) {
      try {
        // Updated to use the v1.2.0 syntax
        const publicKey = secp.getPublicKey(inputVal);
        const addressHex = toHex(publicKey);
        setAddress(addressHex);

        const {
          data: { balance },
        } = await server.get(`balance/${addressHex}`);
        setBalance(balance);

      } catch (error) {
        setBalance(0);
        setAddress("");
      }
    } else {
      setBalance(0);
      setAddress("");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type in a private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>

      <div className="address">
        Address: {address ? `${address.slice(0, 20)}...` : ""}
      </div>
    </div>
  );
}

export default Wallet;