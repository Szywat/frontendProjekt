import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const RegisterForm = () => {
    const [error, setError] = useState(null)
    const router = useRouter();

    return (
        <Formik
            initialValues={{
                username: '',
                email: '',
                password: '',
                firstname: '',
                lastname: '',
                phone: '',
                city: '',
                street: '',
                number: '',
                zipcode: ''
            }}
            validationSchema={Yup.object({
                username: Yup.string()
                    .required('Wymagane'),
                email: Yup.string()
                    .email('Niepoprawny email')
                    .required('Wymagane'),
                password: Yup.string()
                    .required('Wymagane'),
                firstname: Yup.string()
                    .required('Wymagane'),
                lastname: Yup.string()
                    .required('Wymagane'),
                phone: Yup.string()
                    .matches(/^[0-9]{9}$/, "Podaj 9 cyfr numeru telefonu")
                    .required('Wymagane'),
                city: Yup.string()
                    .required('Wymagane'),
                street: Yup.string()
                    .required('Wymagane'),
                number: Yup.string()
                    .required('Wymagane'),
                zipcode: Yup.string()
                    .required('Wymagane')
            })}
            onSubmit={async (values) => {
                
                const res = await fetch("http://127.0.0.1:5000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify(values)
                });

                const data = await res.json();
                if (data.success) {
                    router.push("/login");
                    setError(data.message)
                    
                } else {
                    setError(data.message)
                }

                
            }}
        >
            {({ isSubmitting }) => (
                <div className="max-w-5xl w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <h1 className="text-3xl font-bold text-center text-white mb-8">Zarejestruj się</h1>
                    <Form className="grid grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <Field name="username" type="text" placeholder="Nazwa użytkownika" className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"/>
                            <ErrorMessage name="username" component="div" />

                            <Field name="email" type="email" placeholder="Email" className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"/>
                            <ErrorMessage name="email" component="div" />

                            <Field name="password" type="password" placeholder="Hasło" className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"/>
                            <ErrorMessage name="password" component="div" />
                        </div>
                        <div className="space-y-4">
                            <Field name="firstname" type="text" placeholder="Imię" className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"/>
                            <ErrorMessage name="firstname" component="div" />

                            <Field name="lastname" type="text" placeholder="Nazwisko" className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"/>
                            <ErrorMessage name="lastname" component="div" />

                            <Field name="phone" type="text" placeholder="Numer telefonu" className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"/>
                            <ErrorMessage name="phone" component="div" />
                        </div>
                        <div className="space-y-4">
                            <Field name="city" type="text" placeholder="Miasto" className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"/>
                            <ErrorMessage name="city" component="div" />

                            <Field name="street" type="text" placeholder="Ulica" className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"/>
                            <ErrorMessage name="street" component="div" />

                            <Field name="number" type="text" placeholder="Numer" className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"/>
                            <ErrorMessage name="number" component="div" />

                            <Field name="zipcode" type="text" placeholder="Kod pocztowy" className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"/>
                            <ErrorMessage name="zipcode" component="div" />
                        </div>
                        <div></div>
                        <div className="text-center">{error}</div>
                        <div></div>
                        <div></div>
                        <button type="submit" disabled={isSubmitting} className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 transform hover:scale-105">
                            Zarejestruj
                        </button>
                    </Form>

                    <p className="text-center text-gray-400">
                        Masz już konto?{' '}
                        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                            Zaloguj się
                        </Link>
                        .
                    </p>
                </div>
            )}
        </Formik>
    )
}