interface Props {
  message: string;
}

function ErrorMessage({ message }: Props) {
  return (
    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-4 text-sm">
      {message}
    </div>
  );
}

export default ErrorMessage;