import * as React from "react";
import {cn} from "./utils";

interface InputProps extends React.ComponentProps<"input"> {
    label?: string;
    icon?: React.ReactNode;
    error?: string;
}

function Input({className, type, label, icon, error, ...props}: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-[#424242] mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#757575] pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "w-full h-[48px] rounded-lg border border-[#E0E0E0] bg-white text-[#212121] text-sm transition-all",
                        "focus:outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/20",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
                        "placeholder:text-[#9E9E9E]",
                        icon ? "pl-14 pr-4" : "px-4",
                        error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "",
                        className,
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}

export {Input};
