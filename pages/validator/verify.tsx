// import { Application } from '@verify-wallet/constants'
// import VerifyPage from '@verify-wallet/components'
// import { GlobalFooter } from '@verify-wallet/components/footer';
// import cx from '@hub/lib/cx';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ValidatorVerifyPage = () => {
  // const parsedLocationHash = new URLSearchParams(
  //   window.location.search.substring(1)
  // )
  const [publicKey, setPublicKey] = useState('');
  //const [payload, setPayload] = useState('');
  //const [signedPayload, setSignedPayload] = useState('');
  const [authCode, setAuthCode] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (router && router.query && router.query.code) {
      setAuthCode(String(router.query.code));
    }
  }, [router, router.query]);


  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    } catch (err) {
      alert('Failed to copy text');
    }
  };

  // local
  return (
    <div className="flex flex-col justify-center items-center h-screen p-4 text-center bg-gray-100 text-black">
  <h1 className="text-3xl font-medium mt-8">Follow the steps to get verified:</h1>
  <p className="italic text-center text-neutral-700 mt-4">Do NOT give this information to other parties. If you have any questions or concerns, reach out in the <a href="https://discord.com/invite/solana" className="underline text-black" target="_blank" rel="noopener noreferrer">Solana Tech Discord</a>.</p>
  <div className="text-left text-black p-4 mx-auto w-full md:w-1/2 lg:w-1/2">
    <input
      type="text"
      className="border rounded text-base mb-2 w-full p-2"
      value={publicKey}
      onChange={(e) => setPublicKey(e.target.value)}
      placeholder="1. Enter your public key (cli command: solana address)"
    />
    <p className="text-base text-neutral-700 mt-4">2. Make sure the Solana CLI ({">= 1.16"}) is installed and configured. See the <a href="https://docs.solana.com/cli/install-solana-cli-tools" className="underline text-black">Solana CLI installation guide</a> for more information.</p>
    <p className="text-base text-neutral-700 mt-4">3. Sign the payload using the Solana CLI’s sign-offchain-message command and send to the endpoint.</p>
    <div className="flex justify-between mb-2">
      <pre style={{whiteSpace: "pre-wrap", wordBreak: "break-all"}} className="p-4 bg-gray-200 rounded">{`solana sign-offchain-message `}{`"`}{authCode ? authCode : ':discord-authorization-code'}{`"`}
      {`| xargs -I {} curl -X POST http://localhost:3001/verify-gossip-keypair/`}{publicKey ? publicKey : ':public-key'}{'/'}
      {authCode ? authCode : ':discord-authorization-code'}{` -H 'Content-Type: application/json' -d '{"signature": "'{}'"}'`}
      </pre>
      <button className="ml-4 bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-2 rounded" onClick={() =>
      copyToClipboard(`solana sign-offchain-message "${authCode ? authCode : ':discord-authorization-code'}" | 
      xargs -I {} curl -X POST http://localhost:3001/verify-gossip-keypair/${publicKey ? publicKey : ':public-key'}/${authCode ? authCode : ':discord-authorization-code'} -H 'Content-Type: application/json' -d '{"signature": "'{}'"}'`)
      }>Copy</button>  
    </div>
      {/* <button className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={() =>
        copyToClipboard(`solana sign-offchain-message "${authCode ? authCode : ':discord-authorization-code'}"
        xargs -I {} curl -X POST http://localhost:3001/verify-gossip-keypair/${publicKey ? publicKey : ':public-key'}/`)}>Copy</button>
      // ${authCode ? authCode : ':discord-authorization-code'}{` -H 'Content-Type: application/json' -d '{"signature": "'{}'"}'`})}>Copy</button> */}
  </div>
</div>
  );
}

export default ValidatorVerifyPage
