import React from "react";
// import logoIcon from "../../assets/fixit-icon.svg?react";
import LogoIcon from "../../assets/fixit-icon.svg?react";
/**
 * FixItLogo
 * Uses your original illustrated icon (worker + cityscape, text removed)
 * as a static image, with the wordmark + tagline rendered as real text
 * so you can change the wording anytime without touching the artwork.
 *
 * Usage:
 *   <FixItLogo />
 *   <FixItLogo iconWidth={160} title="FIX IT" tagline="BETTER PLACES. BETTER FUTURE." />
 *   <FixItLogo layout="row" />   // icon beside text instead of stacked
 */
export default function FixItLogo({
    iconWidth = 200,
    title = "InfraCare",
    tagline = "BETTER PLACES. BETTER FUTURE.",
    showTagline = true,
    primaryColor = "#13278F",
    accentColor = "#1E6FE0",
    logoColor = "#13278F",
    layout = "column", // "column" | "row"
    className = "",
    iconClassName = ""
}) {
    const isRow = layout === "row";
    const words = title.split(" ");

    return (
        <div
            className={className}
            style={{
                display: "flex",
                flexDirection: isRow ? "row" : "column",
                alignItems: "center",
                gap: isRow ? "11px" : "4px",
            }}
        >
            <LogoIcon
                className={iconClassName}
                style={{
                    width: iconWidth,
                    height: "auto",
                    display: "block",
                    color: logoColor,
                }}
            />

            <div style={{ textAlign: isRow ? "left" : "center"}}>
                <div
                    style={{
                        fontFamily: "'Arial Black', Arial, sans-serif",
                        fontWeight: 900,
                        fontSize: iconWidth * 0.28,
                        letterSpacing: "1px",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                    }}
                >
                    {words.map((word, i) => (
                        <span
                            key={i}
                            style={{
                                color: i === words.length - 1 ? accentColor : primaryColor,
                                marginRight: "0.25em",
                            }}
                        >
                            {word}
                        </span>
                    ))}
                </div>

                {showTagline && (
                    <div
                        style={{
                            marginTop: "4px",
                            fontFamily: "Arial, sans-serif",
                            fontWeight: 700,
                            fontSize: iconWidth * 0.099,
                            letterSpacing: "1.5px",
                            color: primaryColor,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {tagline}
                    </div>
                )}
            </div>
        </div>
    );
}