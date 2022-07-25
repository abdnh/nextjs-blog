import Head from "next/head";
import { useState } from "react";
import useUser from "../lib/useUser";
import Layout from "../components/layout";


export default function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // TODO: redirect to previous page
    const { mutateUser } = useUser({
        redirectTo: '/',
        redirectIfFound: true,
    });

    async function handleSubmit(event) {
        event.preventDefault();
        const body = {
            username: username,
            password: password,
        }

        const response = await fetch("/api/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),

        });
        const user = await response.json();
        mutateUser(user);
        if (!response.ok) {
            setErrorMessage(response.statusText);
        }
        if (!user) {
            setErrorMessage("معلومات دخول غير صالحة.");
        }
    }
    return (
        <Layout>
            <Head>
                <title>تسجيل الدخول</title>
            </Head>
            <header className="post-header">
                <h1>تسجيل الدخول</h1>
            </header>
            <form onSubmit={handleSubmit} >
                <div>
                    <label htmlFor="username">اسم المستخدم:</label>
                    <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor="password">كلمة السر:</label>
                    <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <input type="submit" value="دخول"></input>
                {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
            <style global jsx>{`
            form {
                margin-block: 1em;
            }
            form > * {
                display: block;
                margin-top: 0.5em;
            }
            label {
                display: inline-block;
                min-width: 100px;
            }
            .error {
                color: red;
            }
            `}</style>
        </Layout>
    )
}
