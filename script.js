const addressContract = "0xb094e61FA505721941218825AEBbb4e91FcFB66B";
const abi = [ { "inputs": [ { "internalType": "string", "name": "_greeting", "type": "string" } ], "name": "setGreeting", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "greet", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ];

let geetContract;

async function conectar() {
    alert("estoy conectando");
    if (typeof window.ethereum !== undefined) {
        console.log("tenemos metamask");
        await window.ethereum.request({"method": "eth_requestAccounts"});
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        document.getElementById("accountAddress").innerText = addr;
        geetContract = new ethers.Contract(addressContract,abi,signer);
    } else {
        alert("creese una metamask");
    }
}

async function leer() {
    const greeting = await geetContract.greet(); //greeting
    document.getElementById("greeting").innerText = greeting;
    alert(greeting);
}

async function Escribir() {
    alert("estoy escribiendo");
    let tx = await geetContract.setGreeting(document.getElementById("value2change").value); 
    await tx.wait();
}