import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { setPassword } from "@/service/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function SetPasswordPage() {
    const { token } = useParams();

    const navigate = useNavigate();

    const [password, setPasswordValue] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();


        console.log("TOKEN =", token);
        console.log("SUBMIT CLICKED");

        try {


            console.log("CALLING API...");
            await setPassword(
                token,
                {
                    password,
                    confirm_password:
                        confirmPassword,
                }
            );

            toast.success(
                "Password set successfully."
            );

            navigate(
                "/login"
            );

        } catch (error) {

            toast.error(
                "Unable to set password."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">

            <form
                onSubmit={handleSubmit}
                className="space-y-4 border p-6 rounded-xl w-96"
            >
                <h1 className="text-xl font-bold">
                    Set Password
                </h1>

                <Input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) =>
                        setPasswordValue(
                            e.target.value
                        )
                    }
                />

                <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(
                            e.target.value
                        )
                    }
                />

                <Button
                    type="submit"
                    className="w-full"
                >
                    Set Password
                </Button>
            </form>
        </div>
    );
}