import Form from "@/components/form";
import Head from "next/head";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Head>
        <title>Online Encryption & Decryption Tool | AES, RSA, Base64</title>
        <meta
          name="description"
          content="Free online tool to encrypt and decrypt text using AES, RSA, Base64, and more. Secure, fast, and easy-to-use."
        />
        <link rel="canonical" href="https://crypto.starbyte.tech/" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Form/>
    </main>
  );
}
