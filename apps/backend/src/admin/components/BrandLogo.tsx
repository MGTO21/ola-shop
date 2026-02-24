import React from "react"

export const BrandLogo = () => {
    return (
        <div className="flex items-center gap-2 px-1">
            <div className="bg-rose-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transform rotate-3">
                <span className="text-white font-black text-xl">ع</span>
            </div>
            <div className="flex flex-col leading-none">
                <span className="text-ui-fg-base font-black text-lg tracking-tight">O L A</span>
                <span className="text-rose-600 font-bold text-[10px] tracking-[0.2em] mt-0.5">S H O P</span>
            </div>
        </div>
    )
}

export const BrandLogoMini = () => {
    return (
        <div className="bg-rose-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-black text-lg">ع</span>
        </div>
    )
}
