const contractAddress ="0x61511a9BB0BAc15e840b26c62f1d40Bf967f6f30";

const contractABI = [
    {
        inputs: [
            {
                internalType: "string",
                name: "_certificateId",
                type: "string"
            }
        ],
        name: "verifyCertificate",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string"
            },
            {
                internalType: "string",
                name: "",
                type: "string"
            },
            {
                internalType: "string",
                name: "",
                type: "string"
            },
            {
                internalType: "string",
                name: "",
                type: "string"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
            {
                internalType: "bool",
                name: "",
                type: "bool"
            }
        ],
        stateMutability: "view",
        type: "function"
    }
];


async function verifyCertificate() {

    const certificateId =
        document.getElementById("certificateId").value.trim();

    const certificateHash =
        document.getElementById("certificateHash").value.trim();

    const result =
        document.getElementById("result");

    if (!certificateId || !certificateHash) {
        result.innerText = "Please enter Certificate ID and Certificate Hash";
        return;
    }

    try {

        // Create ethers interface
        const iface = new ethers.Interface(contractABI);

        // Encode verifyCertificate(CERT123)
        const callData = iface.encodeFunctionData(
            "verifyCertificate",
            [certificateId]
        );

        // Send request directly to Hardhat
        const response = await fetch("https://ethereum-sepolia-rpc.publicnode.com", 
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_call",
                    params: [
                        {
                            to: contractAddress,
                            data: callData
                        },
                        "latest"
                    ],
                    id: 1
                })
            }
        );

        const rpcData = await response.json();

        console.log("Blockchain response:", rpcData);

        if (rpcData.error) {
            throw new Error(rpcData.error.message);
        }

        if (!rpcData.result) {
            throw new Error("No response received from blockchain");
        }

        // Decode blockchain response
        const data = iface.decodeFunctionResult(
            "verifyCertificate",
            rpcData.result
        );

        console.log("Decoded certificate:", data);

        if (data[5] === true && data[3] === certificateHash) {

            result.innerText =
                "Certificate is valid! ✅\n\n" +
                "Student: " + data[1] + "\n" +
                "Course: " + data[2];

        } else {

            result.innerText =
                "Certificate is not valid ❌";
        }

    } catch (error) {

        console.error("Verification error:", error);

        result.innerText =
            "Error: " + error.message;
    }
}
