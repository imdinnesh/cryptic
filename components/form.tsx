"use client";

import { useState } from "react";
import { Copy, Lock, Unlock, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList,TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { encryptResponse, decryptRequest } from "@/lib/crypto";
import { jsonToString, payload } from "@/lib/format";

// Mock functions for demonstration
// const encryptResponse = (text: string, key: string) => `{"ResponseData":"${btoa(text)}:${btoa(key)}"}`;
// const decryptRequest = (text: string, key: string) => {
//     const [data, k] = text.split(':');
//     if (atob(k) !== key) throw new Error("Invalid key");
//     return `{"message": "Decrypted successfully!", "original_payload": "${atob(data)}", "length": ${atob(data).length}, "processed": true, "extra": null}`;
// };
// type payload = { ResponseData: string; };
// const jsonToString = (json: payload): string => json.ResponseData;


export default function CryptoTool() {
    const [inputText, setInputText] = useState("");
    const [key, setKey] = useState("");
    const [result, setResult] = useState("");
    const [mode, setMode] = useState<"encrypt" | "decrypt">("decrypt");
    const [isError, setIsError] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleAction = () => {
        if (!inputText || !key) {
            setResult("❌ Error: Input and key cannot be empty.");
            setIsError(true);
            return;
        }

        setIsError(false);
        setResult("");

        try {
            if (mode === "encrypt") {
                // Encrypt the raw input
                const encrypted = encryptResponse(inputText, key);
                // Wrap the result in the standard JSON response format
                const responsePayload = { ResponseData: encrypted };
                setResult(JSON.stringify(responsePayload, null, 2));
            } else {
                // Decrypt the payload from the input JSON
                let encryptedPayload: string;
                try {
                    const parsedInput: payload = JSON.parse(inputText);
                    encryptedPayload = jsonToString(parsedInput);
                    if (typeof encryptedPayload !== 'string' || encryptedPayload.trim() === '') {
                        throw new Error("'ResponseData' must be a non-empty string.");
                    }
                } catch (e: any) {
                    setResult(`❌ Error: Invalid input format. Must be JSON with 'ResponseData' key. Details: ${e.message}`);
                    setIsError(true);
                    return;
                }

                // Decrypt the extracted payload
                const decrypted = decryptRequest(encryptedPayload, key);

                // Attempt to pretty-print the final decrypted result if it's JSON
                try {
                    const jsonObject = JSON.parse(decrypted);
                    const formattedJson = JSON.stringify(jsonObject, null, 2);
                    setResult(formattedJson);
                } catch (jsonError) {
                    // If not JSON, show the raw decrypted string
                    setResult(decrypted);
                }
            }
        } catch (err: any) {
            console.error(err);
            setResult(`❌ Error: Decryption failed. Check key or encrypted data. Details: ${err.message}`);
            setIsError(true);
        }
    };

    const handleCopy = () => {
        if (result && !isError) {
            navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-6xl space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        AES Encryption & Decryption Tool
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Securely encrypt or decrypt data using an AES key.
                    </p>
                </div>

                <Tabs
                    value={mode}
                    onValueChange={(value) => setMode(value as "encrypt" | "decrypt")}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
                        <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
                    </TabsList>
                </Tabs>

                <ControlPanelContent onAction={handleAction} keyState={[key, setKey]} mode={mode} />

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input</CardTitle>
                            <CardDescription>
                                {mode === "encrypt"
                                    ? "Enter the raw text or JSON you want to encrypt."
                                    : "Paste the JSON object containing the 'ResponseData' here."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                            spellCheck="false"
                                placeholder={
                                    mode === "encrypt"
                                        ? 'Your secret message or {"data": "value"}'
                                        : '{\n  "ResponseData": "PzuBqQ1h/v/b8enC..."\n}'
                                }
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="min-h-[250px] font-mono"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Result</CardTitle>
                            <CardDescription>
                                {mode === "encrypt"
                                    ? "The resulting JSON with encrypted data."
                                    : "The decrypted, formatted result."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="The result will appear here..."
                                value={result}
                                readOnly
                                className={`min-h-[250px] font-mono ${
                                  isError ? "text-red-500" : "text-muted-foreground"
                                }`}
                            />
                            {result && !isError && (
                                <Button variant="outline" onClick={handleCopy} className="w-full gap-2">
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? "Copied!" : "Copy to Clipboard"}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ControlPanelContent({ onAction, keyState, mode }: any) {
    const [key, setKey] = keyState;
    const isEncrypt = mode === 'encrypt';

    return (
        <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row">
                <div className="grid w-full flex-1 gap-2">
                    <Label htmlFor="aes-key" className="sr-only">AES Base64 Key</Label>
                    <Input
                        id="aes-key"
                        placeholder="Enter AES Base64 Key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                    />
                </div>
                <Button onClick={onAction} className="w-full gap-2 sm:w-auto">
                    {isEncrypt ? <Lock size={16} /> : <Unlock size={16} />}
                    {isEncrypt ? "Encrypt" : "Decrypt"}
                </Button>
            </CardContent>
        </Card>
    );
}