import { useNavigate } from "react-router-dom"
import React, { useEffect } from "react";
import { GetStore } from "@services";

export function RequireLogin() {
    const navigate = useNavigate();
    let auth = GetStore("user", "user");

    useEffect(() => {
        if (auth !== "242$725$21") {
            navigate('/login');
        } 
    }, []);
}
