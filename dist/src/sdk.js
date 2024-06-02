"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@metamask/sdk");
const qrcode_1 = __importDefault(require("qrcode"));
const buffer_1 = require("buffer");
const fs_1 = require("fs");
const web3_1 = __importStar(require("web3"));
const License_1 = __importDefault(require("./License"));
// import fetch from 'node-fetch';
// MetaMask SDK
const sdk = new sdk_1.MetaMaskSDK({
    shouldShimWeb3: false,
    storage: {
        enabled: true,
    },
    dappMetadata: {
        name: 'Electron Test Dapp',
        url: 'https://www.electronjs.org/',
    },
    modals: {
        install: ({ link }) => {
            qrcode_1.default.toCanvas(qrCodeDOM, link, (error) => {
                if (error)
                    console.error(error);
            });
            return {};
        },
        otp: () => {
            return {
                updateOTPValue: (otpValue) => {
                    if (otpValue !== '') {
                        otpDOM.innerText = otpValue;
                    }
                },
            };
        },
    },
});
const msgParams = {
    domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: '',
        // Give a user-friendly name to the specific contract you are signing for.
        name: 'Ether Mail',
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        // Just lets you know the latest version. Definitely make sure the field name is correct.
        version: '1',
    },
    message: {
        contents: 'Hello, Bob!',
        attachedMoneyInEth: 4.2,
        from: {
            name: 'Cow',
            wallets: [
                '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
                '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
            ],
        },
        to: [
            {
                name: 'Bob',
                wallets: [
                    '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                    '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
                    '0xB0B0b0b0b0b0B000000000000000000000000000',
                ],
            },
        ],
    },
    // Refers to the keys of the *types* object below.
    primaryType: 'Mail',
    types: {
        EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
        ],
        // Not an EIP712Domain definition
        Group: [
            { name: 'name', type: 'string' },
            { name: 'members', type: 'Person[]' },
        ],
        // Refer to PrimaryType
        Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person[]' },
            { name: 'contents', type: 'string' },
        ],
        // Not an EIP712Domain definition
        Person: [
            { name: 'name', type: 'string' },
            { name: 'wallets', type: 'address[]' },
        ],
    },
};
// DOM Elements
const qrCodeDOM = document.getElementById('qrCode');
const otpDOM = document.getElementById('otp');
// const signButtonDOM = document.getElementById('personalSignButton');
// const signTypedDataButtonDOM = document.getElementById('signTypedDataButton');
const connectButtonDOM = document.getElementById('connectButton');
// const switchChainDOM = document.getElementById('switchChainButton');
// const addPolygonDOM = document.getElementById('addChainButton');
// const switchPolygonDOM = document.getElementById('switchPolygonButton');
const terminateButtonDOM = document.getElementById('terminateButton');
const responseDOM = document.getElementById('response');
const accountsDOM = document.getElementById('account');
const chainDOM = document.getElementById('chain');
const checkLicenseButtonDOM = document.getElementById('checkLicenseButton');
const contractAddressDOM = (document.getElementById('contractAddress'));
const tokenIdDOM = (document.getElementById('tokenId'));
const validDOM = document.getElementById('validationContainer');
const invalidDOM = document.getElementById('invalidationContainer');
const toggleButtons = () => {
    if (checkLicenseButtonDOM.style.display === 'none') {
        checkLicenseButtonDOM.style.display = 'inline';
        // signButtonDOM.style.display = 'inline';
        // signTypedDataButtonDOM.style.display = 'inline';
        // addPolygonDOM.style.display = 'inline';
        // switchPolygonDOM.style.display = 'inline';
        // switchChainDOM.style.display = 'inline';
    }
    else {
        checkLicenseButtonDOM.style.display = 'none';
        // signButtonDOM.style.display = 'none';
        // signTypedDataButtonDOM.style.display = 'none';
        // addPolygonDOM.style.display = 'none';
        // switchPolygonDOM.style.display = 'none';
        // switchChainDOM.style.display = 'none';
    }
};
// App State
let account = '';
let chainId = '';
let response = '';
let provider;
// SDK Functions
// Connect
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    yield sdk.connect().then((accounts) => {
        provider = sdk.getProvider();
        account = accounts === null || accounts === void 0 ? void 0 : accounts[0];
        setEventListeners();
        updateDOM(accountsDOM, account);
        connectButtonDOM.textContent = 'Connected';
        qrCodeDOM.style.display = 'none';
        chainId = provider.getChainId();
        updateDOM(chainDOM, chainId);
        toggleButtons();
    })
        .catch((error) => {
        console.error(error);
    });
});
// Personal Sign
const personal_sign = () => __awaiter(void 0, void 0, void 0, function* () {
    const from = provider.getSelectedAddress();
    const message = 'Hello World from the Electron Example dapp!';
    const hexMessage = '0x' + buffer_1.Buffer.from(message, 'utf8').toString('hex');
    provider.request({
        method: 'personal_sign',
        params: [hexMessage, from, 'Example password'],
    }).then((result) => {
        response = result;
        updateDOM(responseDOM, result.toString());
        console.log('sign', result);
    }).catch((e) => console.log('sign ERR', e));
});
// eth_signTypedData_v4
const eth_signTypedData_v4 = () => __awaiter(void 0, void 0, void 0, function* () {
    let from = provider.getSelectedAddress();
    try {
        if (!from) {
            alert(`Invalid account -- please connect using eth_requestAccounts first`);
            return;
        }
        msgParams.domain.chainId = provider.getChainId();
        const params = [from, JSON.stringify(msgParams)];
        const method = 'eth_signTypedData_v4';
        console.debug(`ethRequest ${method}`, JSON.stringify(params, null, 4));
        console.debug(`sign params`, params);
        const result = yield (provider === null || provider === void 0 ? void 0 : provider.request({ method, params }));
        updateDOM(responseDOM, result.toString());
    }
    catch (e) {
        console.log(e);
        return "Error: " + e.message;
    }
});
// Chain Switch
const switchChain = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentChainId = provider.getChainId();
    const chainToSwitchTo = currentChainId === '0x1' ? '0xaa36a7' : '0x1';
    yield provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainToSwitchTo }],
    });
});
// Switch to Polygon
const switchToPolygon = () => __awaiter(void 0, void 0, void 0, function* () {
    const chainToSwitchTo = '0x89';
    yield provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainToSwitchTo }],
    });
});
// Add Polygon Chain
const addPolygonChain = () => __awaiter(void 0, void 0, void 0, function* () {
    provider
        .request({
        method: 'wallet_addEthereumChain',
        params: [
            {
                chainId: '0x89',
                chainName: 'Polygon',
                blockExplorerUrls: ['https://polygonscan.com'],
                nativeCurrency: { symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com/'],
            },
        ],
    })
        .then((res) => console.log('add', res))
        .catch((e) => console.log('ADD ERR', e));
});
// Terminate
const terminate = () => {
    sdk.terminate();
    connectButtonDOM.textContent = 'Connect';
    toggleButtons();
    accountsDOM.innerText = '';
    chainDOM.innerText = '';
    qrCodeDOM.innerText = '';
    otpDOM.innerText = '';
    responseDOM.innerText = '';
};
const getCountryCode = () => __awaiter(void 0, void 0, void 0, function* () {
    // The URL of the API
    const url = 'https://api.ipdata.co?api-key=efe2b05286e38f3a2028382e92329be13f63e2113d0924a10ed78bdb';
    try {
        // Make the GET request
        const response = yield fetch(url);
        // Check if the request was successful
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        // Parse the JSON from the response
        const data = yield response.json();
        // Log the data
        return data.country_code;
    }
    catch (error) {
        // Log any errors
        console.log(error);
    }
});
const checkLicense = () => __awaiter(void 0, void 0, void 0, function* () {
    const contractAddress = contractAddressDOM.value;
    const tokenId = tokenIdDOM.value;
    console.log('contractAddress', contractAddress);
    console.log('tokenId', tokenId);
    const web3 = new web3_1.default(provider);
    const contract = new web3_1.Contract(License_1.default.abi, contractAddress);
    contract.setProvider(web3.currentProvider);
    let owner;
    yield contract.methods.ownerOf(tokenId).call().then((result) => {
        updateDOM(responseDOM, result);
        owner = result;
    });
    if (owner === web3.utils.toChecksumAddress(account)) {
        let metadata;
        yield contract.methods.getMetadata().call().then((result) => {
            metadata = JSON.parse(result);
        });
        const countryCode = yield getCountryCode();
        if (metadata.region_list.find((region) => region.code === countryCode)) {
            if (metadata.is_whitelist) {
                validDOM.style.display = 'block';
                invalidDOM.style.display = 'none';
            }
            else {
                validDOM.style.display = 'none';
                invalidDOM.style.display = 'block';
            }
        }
    }
    else {
        validDOM.style.display = 'none';
        invalidDOM.style.display = 'block';
    }
});
// Event listeners
connectButtonDOM.onclick = connect;
connectButtonDOM.addEventListener('click', connect);
// signButtonDOM.addEventListener('click', personal_sign);
// signTypedDataButtonDOM.addEventListener('click', eth_signTypedData_v4);
// switchChainDOM.addEventListener('click', switchChain);
// addPolygonDOM.addEventListener('click', addPolygonChain);
// switchPolygonDOM.addEventListener('click', switchToPolygon);
terminateButtonDOM.addEventListener('click', terminate);
checkLicenseButtonDOM.addEventListener('click', checkLicense);
// Entry point
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    if (hasSessionStored()) {
        connectButtonDOM.innerText = 'Reconnecting...';
        yield connect();
    }
});
const setEventListeners = () => {
    provider.on('chainChanged', (chain) => {
        console.log(`chainChanged ${chain}`);
        chainId = chain;
        updateDOM(chainDOM, chain);
    });
    provider.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            updateDOM(accountsDOM, 'MetaMask is disconnected!');
            return;
        }
        console.log(`accountsChanged ${accounts}`);
        account = accounts[0];
        updateDOM(accountsDOM, accounts[0]);
    });
    provider.on('connect', () => {
        qrCodeDOM.innerText = '';
        // signButtonDOM.style.display = 'inline';
        checkLicenseButtonDOM.style.display = 'inline';
        if (account !== '') {
            updateDOM(otpDOM, '');
        }
    });
};
// Helper functions
function updateDOM(domElement, value) {
    domElement.innerText = value;
}
function hasSessionStored() {
    return (0, fs_1.existsSync)('.sdk-comm');
}
