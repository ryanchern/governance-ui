import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ValidatorVerifyPage = () => {

    const [voteAccount, setVoteAccount] = useState(''); // vote account keypair
    const [keypair, setKeypair] = useState(''); // local path to identity keypair
    const [identityKey, setIdentityKey] = useState(''); // identity public key
    const [authCode, setAuthCode] = useState(''); // discord authorization code

    const router = useRouter()

    useEffect(() => {
        if (router && router.query && router.query.code) {
            setAuthCode(String(router.query.code));
        }
    }, [router, router.query]);


    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            alert('Failed to copy text');
        }
    };

    return (
        <div className="h-screen p-4 pt-16 bg-gray-100 text-black">
            <h1 className="text-3xl font-medium mt-8 text-center">Follow the steps to get verified:</h1>
            <p className="italic text-neutral-700 mt-4 text-center">DO NOT give this information to other parties. If you have any questions or concerns, reach out in the <a href="https://discord.com/invite/solana" className="underline text-black" target="_blank" rel="noopener noreferrer">Solana Tech Discord</a>.</p>
            <div className="p-4 mx-auto w-full md:w-1/2 lg:w-1/2">
                <p className="text-base text-neutral-700 mt-4">1. Enter vote account public key address (base-58): </p>
                <input
                    type="text"
                    className="border rounded text-left mb-2 w-full p-2"
                    value={voteAccount}
                    onChange={(e) => setVoteAccount(e.target.value)}
                    placeholder="VOTE ACCOUNT PUBLIC KEY"
                />
                <p className="text-base text-neutral-700 mt-4">2. Enter identity public key address (base-58): </p>
                <input
                    type="text"
                    className="border rounded text-left mb-2 w-full p-2"
                    value={identityKey}
                    onChange={(e) => setIdentityKey(e.target.value)}
                    placeholder="IDENTITY PUBLIC KEY"
                />
                <p className="text-base text-neutral-700 mt-4">3. Enter local path to identity keypair for your validator for the off-chain signature verification: </p>
                <input
                    type="text"
                    className="border rounded text-left mb-2 w-full p-2"
                    value={keypair}
                    onChange={(e) => setKeypair(e.target.value)}
                    placeholder="PATH TO KEYPAIR: /home/..."
                />
                <p className="text-base text-neutral-700 mt-4">4. Make sure the Solana CLI ({">= 1.16"}) is installed and configured. See the <a href="https://docs.solana.com/cli/install-solana-cli-tools" className="underline text-black" target="_blank" rel="noopener noreferrer">Solana CLI installation guide</a> for more information.</p>
                <p className="text-base text-neutral-700 mt-4">5. Sign the payload using the Solana CLI’s sign-offchain-message command and send to the endpoint.</p>
                <div className="flex items-center justify-between mb-2">
                    <div className="p-4 bg-gray-200 rounded text-sm text-gray-800" style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                        {`solana sign-offchain-message -k `}{keypair ? keypair : ':keypair'}{` "`}{authCode ? authCode : ':discord-authorization-code'}{`"`}
                        {` | xargs -I {} curl -X POST http://localhost:3001/verify-gossip-keypair/`}{voteAccount ? voteAccount : ':vote-account'}{'/'}{identityKey ? identityKey : ':identity'}{'/'}
                        {authCode ? authCode : ':discord-authorization-code'}{` -H 'Content-Type: application/json' -d '{"signature": "'{}'"}'`}
                    </div>
                    <button className="ml-4 bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-2 rounded-full transition ease-in-out duration-200"
                        style={{ backgroundColor: '#00b3ff' }}
                        onClick={() =>
                            copyToClipboard(`solana sign-offchain-message -k ${keypair ? keypair : ':keypair'} "${authCode ? authCode : ':discord-authorization-code'}" | 
                    xargs -I {} curl -X POST http://localhost:3001/verify-gossip-keypair/${voteAccount ? voteAccount : ':vote-account'}/${identityKey ? identityKey : ':identity'}/${authCode ? authCode : ':discord-authorization-code'} -H 'Content-Type: application/json' -d '{"signature": "'{}'"}'`)
                        }>Copy</button>
                </div>
            </div>
        </div>

    );
}

export default ValidatorVerifyPage
