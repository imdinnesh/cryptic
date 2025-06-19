"use client"

import { useState, useEffect } from "react"
import { Copy, Lock, Unlock, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { encryptResponse, decryptRequest } from "@/lib/crypto"
import { toast } from "sonner"
import { ThemeToggle } from "./theme-toogle"

// Simple JSON syntax highlighter component
function JsonHighlighter({ json, className }: { json: string; className?: string }) {
    const highlightJson = (jsonString: string) => {
        if (!jsonString) return ""

        // Check if it's valid JSON
        let isValidJson = false
        try {
            JSON.parse(jsonString)
            isValidJson = true
        } catch {
            // Not valid JSON, return as plain text
            return jsonString
        }

        if (!isValidJson) return jsonString

        return jsonString
            .replace(/(".*?")\s*:/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>:')
            .replace(/:\s*(".*?")/g, ': <span class="text-green-600 dark:text-green-400">$1</span>')
            .replace(/:\s*(true|false)/g, ': <span class="text-purple-600 dark:text-purple-400">$1</span>')
            .replace(/:\s*(null)/g, ': <span class="text-gray-500 dark:text-gray-400">$1</span>')
            .replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="text-orange-600 dark:text-orange-400">$1</span>')
            .replace(/([{}[\]])/g, '<span class="text-gray-700 dark:text-gray-300 font-bold">$1</span>')
    }

    const highlightedContent = highlightJson(json)

    return (
        <div className={className}>
            <pre
                className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlightedContent }}
            />
        </div>
    )
}

export default function CryptoTool() {
    const [inputText, setInputText] = useState("")
    const [key, setKey] = useState("")
    const [result, setResult] = useState("")
    const [mode, setMode] = useState<"encrypt" | "decrypt">("decrypt")
    const [isError, setIsError] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setInputText("")
        setResult("")
        setIsError(false)
    }, [mode])

    const handleAction = () => {
        if (!inputText || !key) {
            setResult("❌ Error: Input and key cannot be empty.")
            setIsError(true)
            return
        }

        setIsError(false)
        setResult("")

        try {
            if (mode === "encrypt") {
                const encrypted = encryptResponse(inputText, key)
                const responsePayload = { RequestData: encrypted }
                setResult(JSON.stringify(responsePayload, null, 2))
            } else {
                let encryptedPayload: string
                try {
                    const parsedInput = JSON.parse(inputText)
                    const data = parsedInput.ResponseData || parsedInput.RequestData
                    if (typeof data !== "string" || data.trim() === "") {
                        throw new Error("Input JSON must contain a non-empty string for 'ResponseData' or 'RequestData'.")
                    }
                    encryptedPayload = data
                } catch (e: any) {
                    if (inputText.trim()) {
                        encryptedPayload = inputText
                    } else {
                        throw new Error(`Invalid input format. ${e.message}`)
                    }
                }

                const decrypted = decryptRequest(encryptedPayload, key)
                try {
                    const jsonObject = JSON.parse(decrypted)
                    setResult(JSON.stringify(jsonObject, null, 2))
                } catch {
                    setResult(decrypted)
                }
            }
        } catch (err: any) {
            console.error(err)
            setResult(`❌ Error: Operation failed. Check key or encrypted data. Details: ${err.message}`)
            setIsError(true)
        }
    }

    const handleCopy = () => {
        if (result && !isError) {
            navigator.clipboard.writeText(result)
            setCopied(true)
            toast.success("Result copied to clipboard!")
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const generateInputDescription = () => {
        if (!inputText) {
            return mode === "encrypt"
                ? "Enter the raw text or JSON to encrypt."
                : "Paste the JSON with 'ResponseData'/'RequestData' or just the encrypted string."
        }
        try {
            const parsed = JSON.parse(inputText)
            const key = parsed.ResponseData ? "ResponseData" : "RequestData"
            if (parsed[key]) return `Valid JSON detected. ${key} length: ${parsed[key].length}`
            return "Valid JSON, but 'ResponseData' or 'RequestData' key is missing."
        } catch {
            return `Plain text input detected. Length: ${inputText.length}`
        }
    }

    const isEncrypt = mode === "encrypt"

    // Check if result is valid JSON for highlighting
    const isResultJson = () => {
        if (!result || isError) return false
        try {
            JSON.parse(result)
            return true
        } catch {
            return false
        }
    }

    return (
        <div className="flex h-screen w-full flex-col bg-background p-4 sm:p-6 overflow-hidden">
            <header className="mb-4 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AES Encryption & Decryption Tool</h1>
                        <p className="text-muted-foreground">Securely encrypt or decrypt data using an AES key.</p>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <Card className="mb-4 shrink-0">
                <CardContent className="flex flex-col items-center gap-4 p-4 sm:flex-row">
                    <Tabs value={mode} onValueChange={(value) => setMode(value as "encrypt" | "decrypt")}>
                        <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                            <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
                            <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="w-full flex-1">
                        <Label htmlFor="aes-key" className="sr-only">
                            AES Base64 Key
                        </Label>
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

            <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 overflow-hidden">
                <Card className="flex flex-col overflow-hidden">
                    <CardHeader>
                        <CardTitle>Input</CardTitle>
                        <CardDescription>{generateInputDescription()}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-4">
                        <div className="relative h-full min-h-[200px] w-full flex-1">
                            <Textarea
                                spellCheck="false"
                                placeholder={
                                    isEncrypt
                                        ? 'Your secret message or {"data": "value"}'
                                        : '{\n  "ResponseData": "PzuBqQ1h/v/b8enC..."\n}'
                                }
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="h-full text-blue-600 dark:text-blue-400 min-h-[200px] w-full flex-1 resize-none overflow-auto font-mono "
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col overflow-hidden">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle>Result</CardTitle>
                                <CardDescription>
                                    {isEncrypt ? "The resulting JSON with encrypted data." : "The decrypted, formatted result."}
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
                    <CardContent className="flex-1 overflow-hidden p-4">
                        {result && isResultJson() && !isError ? (
                            <div className="h-full min-h-[200px] w-full flex-1 overflow-auto rounded-md border p-3">
                                <JsonHighlighter json={result} className="h-full" />
                            </div>
                        ) : (
                            <Textarea
                                placeholder="The result will appear here..."
                                value={result}
                                readOnly
                                className={`w-full h-full min-h-[200px] flex-1 resize-none overflow-auto font-mono ${isError ? "text-red-500" : ""
                                    }`}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
