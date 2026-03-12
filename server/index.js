const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

// Updated to use the v1.2.0 syntax
const secp = require("ethereum-cryptography/secp256k1");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

// PULL YOUR 3 PUBLIC KEYS BACK IN HERE:
const balances = {
  "044f240f9fc19df49e2fdb34933887d91fbe64034ab8894858accedf717c964ca36acf851045c94a1c6d993079de3376bc0a5954e45c5ef236613b8a084b3468e9": 100,
  "0467b66f31ab2cc958009d02e819332add89f2b2dbf596493f774ff0dafa385138370e76a75064cb1dd519cc7a7fbcd33a31aad22677d44b64e3f6d7f31ac8688d": 50,
  "04e373a5ff67e20f22d848b48e9cb3e44cb23a13c8edc8f0ea4288892bbb5a806078da5137ab42922ffc2c25683ab54c2a7ef8bd8a547149d50cc5fbb10858c7a5": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, recoveryBit, messageHash } = req.body;

  try {
    const sigBytes = hexToBytes(signature);
    const hashBytes = hexToBytes(messageHash);

    // Updated to use the v1.2.0 syntax
    const publicKey = secp.recoverPublicKey(hashBytes, sigBytes, recoveryBit);
    const recoveredAddress = toHex(publicKey);

    if (recoveredAddress !== sender) {
      return res.status(401).send({ message: "Invalid signature! You do not own this address." });
    }

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (error) {
    res.status(400).send({ message: "An error occurred verifying the transaction." });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}