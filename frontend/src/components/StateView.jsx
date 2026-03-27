export default function StateView({ loading, error, isEmpty, emptyText = 'No data', children }) {
  if (loading) return <p className="state loading">Loading...</p>;
  if (error) return <p className="state error">{error}</p>;
  if (isEmpty) return <p className="state empty">{emptyText}</p>;
  return children;
}
