interface Props {
  message: string;
}

function ErrorMessage({ message }: Props) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
      {message}
    </div>
  );
}

export default ErrorMessage;