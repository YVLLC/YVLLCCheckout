// components/Loader.tsx

type LoaderProps = {
  text?: string;
};

export default function Loader({ text = "Loading..." }: LoaderProps) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        fontSize: 20,
        color: "#007bff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span className="loader" />
      <span>{text}</span>
    </div>
  );
}
