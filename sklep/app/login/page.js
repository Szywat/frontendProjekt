"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false)
  const [loginMessage, setLoginMessage] = useState(null)
  const router = useRouter();

    return (
        <Formik
        initialValues={{
            username: '',
            password: ''
        }}
        validationSchema={Yup.object({
            username: Yup.string()
                .required('Podaj username'),
            password: Yup.string()
                .required('Podaj hasło')
        })}

        // wysyłać na login na backend
        onSubmit={async (values) => {
            setIsLoggingIn(true);
                const response = await fetch("http://127.0.0.1:5000/login", {
                    method: "POST",
                    body: JSON.stringify({
                      "username": values.username,
                      "password": values.password,
                    }),
                    headers: {'Content-Type': 'application/json'},
                  })

                  if (!response.ok) {
                    setErrorLogin(true)
                    setIsLoggingIn(false)
                  }

                const data = await response.json()
                if (data.success) {
                    setLoginMessage(data.message)
                    localStorage.setItem('username', values.username) 
                    localStorage.setItem('role', data.role)
                    if (data.role === "admin") {
                        router.push("/admin_dashboard")
                      } else {
                        router.push("/")
                      }

                } else {
                    setLoginMessage(data.message)
                }


                
        }}
        >
        {({ isSubmitting }) => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <h1 className="text-3xl font-bold text-center text-white mb-8">Zaloguj się</h1>
                    <Form>
                        <div className="space-y-4">
                            <Field name="username" type="username" placeholder="Adres username" className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400" />
                            <ErrorMessage name="username" component="div"/>

                            <Field name="password" type="password" placeholder="Hasło" className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400" />
                            <ErrorMessage name="password" component="div"/>
                            
                            {errorLogin ? <div>{loginMessage}</div> : null}
                            
                            <button type="submit" disabled={isSubmitting} className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 transform hover:scale-105">
                                {isLoggingIn ? 'Logowanie...' : 'Zaloguj się'}
                            </button>
                        </div>
                    </Form>
                    <p className="text-center text-gray-400 mt-4">
                        Nie masz konta?{' '}
                        <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                            Zarejestruj się
                        </Link>
                        .
                    </p>
                </div>

            </div>
        )}
        </Formik>
        );
};