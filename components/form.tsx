"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { encryptResponse, decryptRequest } from "@/lib/crypto";
import { toast } from "sonner";

// Mock functions for demonstration
// const encryptResponse = (text: string, key: string) => `{"ResponseData":"${btoa(text)}:${btoa(key)}"}`;
// const decryptRequest = (text: string, key: string) => {
//     const [data, k] = text.split(':');
//     if (atob(k) !== key) throw new Error("Invalid key");
//     return `{"message": "Decrypted successfully!", "original_payload": "${atob(data)}", "length": ${atob(data).length}, "processed": true, "extra": null}`;
// };


export default function CryptoTool() {
    const [inputText, setInputText] = useState("");
    const [key, setKey] = useState("");
    const [result, setResult] = useState("");
    const [mode, setMode] = useState<"encrypt" | "decrypt">("decrypt");
    const [isError, setIsError] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setInputText("");
        setResult("");
        setIsError(false);
    }, [mode]);

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
                const encrypted = encryptResponse(inputText, key);
                // CHANGE: Simplified the output structure for encryption
                const responsePayload = { RequestData: encrypted };
                setResult(JSON.stringify(responsePayload, null, 2));
            } else {
                let encryptedPayload: string;
                try {
                    const parsedInput = JSON.parse(inputText);
                    const data = parsedInput.ResponseData || parsedInput.RequestData;

                    if (typeof data === 'string' && data.trim() !== '') {
                        encryptedPayload = data;
                    } else {
                        throw new Error("Input JSON must contain a non-empty string for 'ResponseData' or 'RequestData'.");
                    }
                } catch (e: any) {
                    setResult(`❌ Error: Invalid input format. ${e.message}`);
                    setIsError(true);
                    return;
                }

                const decrypted = decryptRequest(encryptedPayload, key);

                try {
                    const jsonObject = JSON.parse(decrypted);
                    setResult(JSON.stringify(jsonObject, null, 2));
                } catch (jsonError) {
                    setResult(decrypted);
                }
            }
        } catch (err: any) {
            console.error(err);
            setResult(`❌ Error: Operation failed. Check key or encrypted data. Details: ${err.message}`);
            setIsError(true);
        }
    };

    const handleCopy = () => {
        if (result && !isError) {
            navigator.clipboard.writeText(result);
            setCopied(true);
            toast.success("Result copied to clipboard!")
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const generateInputDescription = () => {
        const baseDescription = mode === "encrypt"
            ? "Enter the raw text or JSON to encrypt."
            : "Paste the JSON with 'ResponseData' or 'RequestData'.";

        if (!inputText) return baseDescription;

        try {
            const parsed = JSON.parse(inputText);
            const key = parsed.ResponseData ? 'ResponseData' : 'RequestData';
            if (parsed[key]) {
                return `Valid JSON detected. ${key} length: ${parsed[key].length}`;
            }
            return "Valid JSON detected, but required key is missing.";
        } catch {
            return `Plain text input detected. Length: ${inputText.length}`;
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

                {/* CHANGE: Simplified props for ControlPanelContent for better readability */}
                <ControlPanelContent onAction={handleAction} keyVal={key} onKeyChange={setKey} mode={mode} />

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input</CardTitle>
                            {/* CHANGE: Using the new dynamic description function */}
                            <CardDescription>
                                {generateInputDescription()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                spellCheck="false"
                                placeholder={
                                    mode === 'encrypt'
                                        ? 'Your secret message or {"data": "value"}'
                                        : '{\n  "ResponseData": "PzuBqQ1h/v/b8enC..."\n}'
                                }
                                // CHANGE: The value is now directly tied to the state. This is crucial.
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="min-h-[250px] font-mono"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        {/* CHANGE: The CardHeader is now a flex container to position the copy button correctly. */}
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle>Result</CardTitle>
                                    <CardDescription>
                                        {mode === "encrypt"
                                            ? "The resulting JSON with encrypted data."
                                            : "The decrypted, formatted result."}
                                    </CardDescription>
                                </div>
                                {result && !isError && (
                                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                                        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                        <span className="sr-only">Copy to Clipboard</span>
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="The result will appear here..."
                                value={result}
                                readOnly
                                className={`min-h-[250px] font-mono ${isError ? "text-red-500" : ""
                                    }`}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// CHANGE: Renamed props for clarity (keyState -> keyVal, onKeyChange).
function ControlPanelContent({ onAction, keyVal, onKeyChange, mode }: { onAction: () => void; keyVal: string; onKeyChange: (value: string) => void; mode: 'encrypt' | 'decrypt' }) {
    const isEncrypt = mode === 'encrypt';

    return (
        <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row">
                <div className="grid w-full flex-1 gap-2">
                    <Label htmlFor="aes-key" className="sr-only">AES Base64 Key</Label>
                    <Input
                        id="aes-key"
                        placeholder="Enter AES Base64 Key"
                        value={keyVal}
                        onChange={(e) => onKeyChange(e.target.value)}
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