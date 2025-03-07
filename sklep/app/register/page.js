"use client";

import { useEffect, useState} from "react";
import Link from "next/link";
import { RegisterForm } from "../components/RegisterForm";


export default function RegisterPage() {
return (
    <div className="min-h-screen flex items-center justify-center"> 
        <RegisterForm />
    </div>
);
}
