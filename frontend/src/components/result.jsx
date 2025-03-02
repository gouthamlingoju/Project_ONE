export default function Result({ result }) {
  return (
    <div>
      <h2>{result.title}</h2>
      <p>{result.description}</p>
    </div>
  );
}