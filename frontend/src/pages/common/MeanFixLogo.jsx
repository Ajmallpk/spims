export default function MeanFixLogo({ size = 45 }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
      >
        {/* Circle */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="white"
          stroke="#0057D9"
          strokeWidth="4"
        />

        {/* City */}
        <rect x="58" y="35" width="10" height="30" fill="#0057D9" />
        <rect x="70" y="28" width="12" height="37" fill="#0057D9" />
        <rect x="46" y="45" width="10" height="20" fill="#0057D9" />

        {/* Worker */}
        <circle cx="28" cy="35" r="6" fill="#0057D9" />
        <path
          d="M28 42 L23 55 L27 55 L30 48 L36 58 L41 58 L34 42"
          fill="#0057D9"
        />

        {/* Wrench */}
        <line
          x1="33"
          y1="46"
          x2="48"
          y2="38"
          stroke="#0057D9"
          strokeWidth="3"
        />
      </svg>

      <div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#0057D9",
            lineHeight: 1,
          }}
        >
          Mean Fix
        </div>

        <div
          style={{
            fontSize: "10px",
            color: "#0057D9",
            letterSpacing: "1px",
          }}
        >
          Better Places. Better Future.
        </div>
      </div>
    </div>
  );
}