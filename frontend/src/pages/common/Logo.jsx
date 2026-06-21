function Logo({ width = 180 }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}
    >
      {/* Circle */}
      <div
        style={{
          width: width * 0.25,
          height: width * 0.25,
          borderRadius: "50%",
          border: "6px solid #0057D8",
          position: "relative"
        }}
      >
        {/* Worker */}
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "20%",
            width: "50%",
            height: "50%",
            background: "#0057D8",
            borderRadius: "50%"
          }}
        />
      </div>

      <div>
        <h2
          style={{
            color: "#0057D8",
            margin: 0,
            fontWeight: "bold"
          }}
        >
          MEAN FIX
        </h2>

        <p
          style={{
            margin: 0,
            color: "#0057D8",
            fontSize: "12px"
          }}
        >
          BETTER PLACES. BETTER FUTURE.
        </p>
      </div>
    </div>
  );
}

export default Logo;