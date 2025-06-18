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
//     if (!text || !key) throw new Error("Invalid input or key");
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

    // Effect to reset fields when switching modes
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
                const responsePayload = { RequestData: encrypted };
                setResult(JSON.stringify(responsePayload, null, 2));
            } else { // Decrypt mode
                let encryptedPayload: string;
                try {
                    const parsedInput = JSON.parse(inputText);
                    const data = parsedInput.ResponseData || parsedInput.RequestData;
                    if (typeof data !== 'string' || data.trim() === '') {
                        throw new Error("Input JSON must contain a non-empty string for 'ResponseData' or 'RequestData'.");
                    }
                    encryptedPayload = data;
                } catch (e: any) {
                    // If parsing fails, treat input as a raw encrypted string
                    if (inputText.trim()) {
                        encryptedPayload = inputText;
                    } else {
                        throw new Error(`Invalid input format. ${e.message}`);
                    }
                }

                const decrypted = decryptRequest(encryptedPayload, key);
                try {
                    // Try to format if the result is valid JSON
                    const jsonObject = JSON.parse(decrypted);
                    setResult(JSON.stringify(jsonObject, null, 2));
                } catch (jsonError) {
                    // Otherwise, show the raw decrypted string
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
            toast.success("Result copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Helper to provide contextual information about the input text
    const generateInputDescription = () => {
        if (!inputText) {
            return mode === "encrypt"
                ? "Enter the raw text or JSON to encrypt."
                : "Paste the JSON with 'ResponseData'/'RequestData' or just the encrypted string.";
        }
        try {
            const parsed = JSON.parse(inputText);
            const key = parsed.ResponseData ? 'ResponseData' : 'RequestData';
            if (parsed[key]) return `Valid JSON detected. ${key} length: ${parsed[key].length}`;
            return "Valid JSON, but 'ResponseData' or 'RequestData' key is missing.";
        } catch {
            return `Plain text input detected. Length: ${inputText.length}`;
        }
    };

    const isEncrypt = mode === 'encrypt';

    return (
        // CHANGE: Main container now uses flex-col and h-screen to better manage space.
        <div className="flex h-screen w-full flex-col bg-background p-4 sm:p-6">
            <header className="mb-4 shrink-0">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    AES Encryption & Decryption Tool
                </h1>
                <p className="text-muted-foreground">
                    Securely encrypt or decrypt data using an AES key.
                </p>
            </header>

            {/* CHANGE: A single, compact control panel card for all actions. */}
            <Card className="mb-4 shrink-0">
                <CardContent className="flex flex-col items-center gap-4 p-4 sm:flex-row">
                    <Tabs
                        value={mode}
                        onValueChange={(value) => setMode(value as "encrypt" | "decrypt")}
                    >
                        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
                            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="w-full flex-1">
                        <Label htmlFor="aes-key" className="sr-only">AES Base64 Key</Label>
                        <Input
                            id="aes-key"
                            placeholder="Enter AES Base64 Key"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleAction} className="w-full gap-2 sm:w-auto">
                        {isEncrypt ? <Lock size={16} /> : <Unlock size={16} />}
                        {isEncrypt ? "Encrypt" : "Decrypt"}
                    </Button>
                </CardContent>
            </Card>

            {/* CHANGE: This grid now grows to fill the remaining vertical space. */}
            <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
                {/* CHANGE: Card and its content use flex to allow the textarea to grow. */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Input</CardTitle>
                        <CardDescription>{generateInputDescription()}</CardDescription>
                    </CardHeader>
                    {/* CHANGE: Textarea is now flexible and will fill the card's space. */}
                    <CardContent className="flex-1">
                        <Textarea
                            spellCheck="false"
                            placeholder={
                                isEncrypt
                                    ? 'Your secret message or {"data": "value"}'
                                    : '{\n  "ResponseData": "PzuBqQ1h/v/b8enC..."\n}'
                            }
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="h-[400px] min-h-[200px] resize-none font-mono"
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle>Result</CardTitle>
                                <CardDescription>
                                    {isEncrypt
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
                    <CardContent className="flex-1">
                        <Textarea
                            placeholder="The result will appear here..."
                            value={result}
                            readOnly
                            className={`min-h-[200px] h-[400px] resize-none font-mono ${isError ? "text-red-500" : ""}`}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}