"use client";
import { useState } from "react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createAssociatedTokenAccountInstruction,
  createMint,
  mintTo,
} from "@solana/spl-token";

const MintNFT = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [minting, setMinting] = useState(false);
  const [mintAddress, setMintAddress] = useState(null);

  const handleMint = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    setMinting(true);

    try {
      const mint = Keypair.generate();
      const lamports = await connection.getMinimumBalanceForRentExemption(
        82
      );

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mint.publicKey,
          lamports,
          space: 82,
          programId: new PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          ),
        }),
        createMint(
          publicKey,
          publicKey,
          0,
          mint.publicKey,
          publicKey
        )
      );

      const signature = await sendTransaction(transaction, connection, {
        signers: [mint],
      });

      await connection.confirmTransaction(signature, "processed");

      const associatedTokenAccount = await createAssociatedTokenAccountInstruction(
        publicKey,
        mint.publicKey,
        publicKey,
        mint.publicKey
      );

      const mintTx = await mintTo(
        connection,
        publicKey,
        mint.publicKey,
        associatedTokenAccount,
        publicKey,
        1
      );

      setMintAddress(mint.publicKey.toBase58());
    } catch (error) {
      console.error("Error minting NFT:", error);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div>
      <h1>Mint an NFT on Solana</h1>
      <button onClick={handleMint} disabled={minting}>
        {minting ? "Minting..." : "Mint NFT"}
      </button>
      {mintAddress && <p>Mint Address: {mintAddress}</p>}
    </div>
  );
};

export default MintNFT;
