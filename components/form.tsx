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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { encryptResponse, decryptRequest } from "@/lib/crypto";

// Mock crypto functions for demonstration if you don't have them
// const encryptResponse = (text: string, key: string) => `{"message":"encrypted(${text}, ${key})"}`;
// const decryptRequest = (text: string, key: string) => `{"data":{"user_id":123,"permissions":["read","write"],"payload":"${text}"},"timestamp":"2023-10-27T10:00:00Z"}`;


export default function CryptoTool() {
    const [inputText, setInputText] = useState("");
    const [key, setKey] = useState("");
    const [result, setResult] = useState("");
    // Change #1: Default mode is now 'decrypt'
    const [mode, setMode] = useState<"encrypt" | "decrypt">("decrypt");
    const [isError, setIsError] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleAction = () => {
        if (!inputText || !key) {
            setResult("❌ Error: Input text and key cannot be empty.");
            setIsError(true);
            return;
        }

        setIsError(false);
        setResult("");

        try {
            if (mode === "encrypt") {
                const encrypted = encryptResponse(inputText, key);
                setResult(encrypted);
            } else {
                const decrypted = decryptRequest(inputText, key);

                // Change #2: Attempt to format the result if it's JSON
                try {
                    // Try to parse the decrypted text as JSON
                    const jsonObject = JSON.parse(decrypted);
                    // If successful, stringify it with formatting (2-space indentation)
                    const formattedJson = JSON.stringify(jsonObject, null, 2);
                    setResult(formattedJson);
                } catch (jsonError) {
                    // If it's not valid JSON, just show the decrypted text as is
                    setResult(decrypted);
                }
            }
        } catch (err) {
            console.error(err);
            setResult("❌ Error: Invalid input or key. Check console for details.");
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
                        Securely encrypt or decrypt text using an AES key.
                    </p>
                </div>

                <Tabs
                    value={mode}
                    onValueChange={(value) => {
                        setMode(value as "encrypt" | "decrypt");
                        // Optional: Clear fields on mode switch for a cleaner experience
                        // setInputText("");
                        // setResult("");
                    }}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
                        <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
                    </TabsList>
                    {/* We only need one control panel, which we can place outside TabsContent */}
                </Tabs>

                {/* Control Panel - Extracted from TabsContent for a single source of truth */}
                <ControlPanelContent onAction={handleAction} keyState={[key, setKey]} mode={mode} />

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input</CardTitle>
                            <CardDescription>
                                {mode === "encrypt"
                                    ? "Enter the text or JSON you want to encrypt."
                                    : "Paste the encrypted data here."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder={
                                    mode === "encrypt"
                                        ? 'Your secret message or {"data": "value"}...'
                                        : "eyJjdCI6Im..."
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
                                {/* Change #3: Updated description for decryption mode */}
                                {mode === "encrypt"
                                    ? "The resulting encrypted data."
                                    : "The original, decrypted text. JSON output will be automatically formatted."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="The result will appear here..."
                                value={result}
                                readOnly
                                className={`min-h-[250px] font-mono ${isError ? "text-red-500" : "text-muted-foreground"
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
                    {/* <Label htmlFor="aes-key">AES Base64 Key</Label> */}
                    <Input
                        id="aes-key"
                        placeholder="Enter your secret key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                    />
                </div>
                <Button onClick={onAction} className="w-full gap-2 sm:w-auto">
                    {isEncrypt ? <Lock size={16} /> : <Unlock size={16} />}
                    {isEncrypt ? "Encrypt Text" : "Decrypt Text"}
                </Button>
            </CardContent>
        </Card>
    );
}